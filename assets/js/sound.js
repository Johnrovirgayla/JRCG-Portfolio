(() => {
  'use strict';
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;

  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  let sfxOn = store.get('jrcg-sfx') !== 'off';   // effects: on by default
  let musicOn = store.get('jrcg-music') !== 'off'; // music: ON by default (stays off only if the visitor turns it off)
  let ctx, sfxBus, musicBus, timer = null, nextT = 0, step = 0;

  /* ---------- audio engine ---------- */
  function ensure() {
    if (!ctx) {
      ctx = new AC();
      const master = ctx.createGain(); master.gain.value = 1;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.knee.value = 20; comp.ratio.value = 4; comp.attack.value = .005; comp.release.value = .25;
      master.connect(comp); comp.connect(ctx.destination);
      sfxBus = ctx.createGain(); sfxBus.gain.value = 1.6; sfxBus.connect(master);
      musicBus = ctx.createGain(); musicBus.gain.value = 0; musicBus.connect(master);
      const echo = ctx.createDelay(1), fb = ctx.createGain(), wet = ctx.createGain();
      echo.delayTime.value = .375; fb.gain.value = .35; wet.gain.value = .4;
      musicBus.connect(echo); echo.connect(fb); fb.connect(echo); echo.connect(wet); wet.connect(master);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  }
  const ready = () => ctx && ctx.state === 'running';

  function tone(freq, dur = .12, o = {}) {
    if (!sfxOn || !ready()) return;
    const { type = 'sine', vol = .06, slide = 0, delay = 0 } = o;
    const t = ctx.currentTime + delay, osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + .01);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    osc.connect(g); g.connect(sfxBus); osc.start(t); osc.stop(t + dur + .03);
  }
  const arp = (notes, gap, dur, vol) => notes.forEach((f, i) => tone(f, dur, { vol, delay: i * gap }));

  /* ---------- the sounds (change the numbers to tweak them) ---------- */
  let lastPop = 0;
  const S = {
    hover: () => tone(1200, .04, { type: 'triangle', vol: .02 }),
    click: () => { tone(520, .08, { type: 'square', vol: .035, slide: 780 }); tone(1040, .1, { vol: .05, delay: .06 }); },
    tab:   () => tone(400, .14, { type: 'triangle', vol: .07, slide: 900 }),
    star:  i => tone(500 + i * 120, .16, { vol: .06 }),
    dark:  () => tone(330, .28, { type: 'triangle', vol: .07, slide: 150 }),
    light: () => tone(500, .28, { type: 'triangle', vol: .07, slide: 1200 }),
    open:  () => arp([523, 659, 784], .07, .18, .055),
    close: () => arp([784, 523], .07, .16, .05),
    send:  () => tone(600, .1, { type: 'triangle', vol: .06, slide: 1000 }),
    pop:   () => { const n = Date.now(); if (n - lastPop > 200) { lastPop = n; tone(700, .09, { vol: .07, slide: 1100 }); } },
    success: () => arp([523, 659, 784, 1047], .09, .22, .06)
  };

  /* ---------- background music (soft Am–F–C–G loop) ---------- */
  const CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]; // MIDI notes
  const ARP = [0, 1, 2, 1, 0, 2, 1, 2], STEP = .36;
  const mf = m => 440 * Math.pow(2, (m - 69) / 12);

  function note(f, t, dur, o = {}) {
    const { type = 'triangle', vol = .04, lp = 2400, attack = .02 } = o;
    const osc = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
    osc.type = type; osc.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = lp;
    g.gain.setValueAtTime(.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    osc.connect(fl); fl.connect(g); g.connect(musicBus); osc.start(t); osc.stop(t + dur + .05);
  }
  function playStep(s, t) {
    const c = CHORDS[Math.floor(s / 16) % CHORDS.length], i = s % 16;
    if (i === 0) c.forEach(m => note(mf(m), t, STEP * 16, { type: 'sawtooth', vol: .024, lp: 500, attack: .8 }));
    if (i === 0 || i === 8) note(mf(c[0] - 12), t, STEP * 7, { type: 'sine', vol: .15, attack: .03 });
    if (i % 2 === 0) note(mf(c[ARP[(i / 2) % ARP.length]] + 12), t, STEP * 3, { vol: .085, lp: 2600 });
  }
  function startMusic() {
    ensure(); if (timer) return;
    musicBus.gain.setTargetAtTime(1.2, ctx.currentTime, .4); // music volume (bigger = louder)
    nextT = ctx.currentTime + .1; step = 0;
    timer = setInterval(() => {
      while (nextT < ctx.currentTime + .5) { playStep(step, nextT); nextT += STEP; step++; }
    }, 100);
  }
  function stopMusic() {
    if (!timer) return;
    clearInterval(timer); timer = null;
    musicBus.gain.setTargetAtTime(0, ctx.currentTime, .25);
  }

  /* ---------- navbar buttons ---------- */
  const style = document.createElement('style');
  style.textContent = '.theme-toggle.off{opacity:.5}#music-toggle.on{color:#e50914;border-color:#e50914}';
  document.head.appendChild(style);

  const mk = id => { const b = document.createElement('button'); b.id = id; b.className = 'theme-toggle'; return b; };
  const sfxBtn = mk('sound-toggle'), musicBtn = mk('music-toggle');
  const navRight = document.querySelector('.nav-right');
  if (navRight) navRight.prepend(sfxBtn, musicBtn);

  function paint() {
    sfxBtn.innerHTML = `<i class="fa-solid fa-volume-${sfxOn ? 'high' : 'xmark'}"></i>`;
    sfxBtn.title = sfxBtn.ariaLabel = sfxOn ? 'Sound effects: on' : 'Sound effects: off';
    sfxBtn.classList.toggle('off', !sfxOn);
    musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
    musicBtn.title = musicBtn.ariaLabel = musicOn ? 'Background music: on' : 'Background music: off';
    musicBtn.classList.toggle('on', musicOn); musicBtn.classList.toggle('off', !musicOn);
  }
  paint();

  sfxBtn.addEventListener('click', () => {
    ensure(); sfxOn = !sfxOn; store.set('jrcg-sfx', sfxOn ? 'on' : 'off'); paint();
    if (sfxOn) setTimeout(S.click, 80);
  });
  musicBtn.addEventListener('click', () => {
    ensure(); musicOn = !musicOn; store.set('jrcg-music', musicOn ? 'on' : 'off'); paint();
    musicOn ? startMusic() : stopMusic();
  });

  /* ---------- browsers only allow sound after the first click/tap/key ---------- */
  const unlockEvents = ['pointerdown', 'keydown', 'touchstart', 'touchend', 'click'];
  const unlock = () => {
    ensure();
    ctx.resume().then(() => {
      if (ctx.state !== 'running') return;          // e.g. touchstart on phones: wait for the next event
      unlockEvents.forEach(ev => removeEventListener(ev, unlock));
      if (musicOn) startMusic();
      closeGate();
    }).catch(() => {});
  };
  unlockEvents.forEach(ev => addEventListener(ev, unlock, { passive: true }));

  /* ---------- "Click to enter" screen: the music starts right after loading ----------
     Browsers block sound until the visitor clicks, so after the loading bar finishes the
     visitor clicks once and the music starts. If the browser allows autoplay, the music
     starts by itself and this screen never shows. */
  const ENTER_SCREEN = true;   // false = no enter screen (music starts on the first click/tap/key instead)
  let gate = null;
  function closeGate() {
    if (!gate) return;
    const g = gate; gate = null; g.classList.add('hide'); setTimeout(() => g.remove(), 700);
  }
  if (musicOn && ENTER_SCREEN) {
    style.textContent += '.enter-gate{position:fixed;inset:0;z-index:10000;background:#050505;display:grid;place-items:center;cursor:pointer;transition:opacity .6s,visibility .6s}'
      + '.enter-gate.hide{opacity:0;visibility:hidden}.enter-gate>div{display:flex;flex-direction:column;align-items:center;text-align:center}'
      + '.enter-text{margin:26px 0 0;color:#aaa;font-size:.8rem;letter-spacing:.14em;text-transform:uppercase;opacity:0;transition:opacity .5s;animation:enterPulse 1.6s ease-in-out infinite}'
      + '.enter-text.show{opacity:1}.enter-text i{color:#e50914;margin-left:6px}@keyframes enterPulse{50%{color:#fff}}';
    gate = document.createElement('div');
    gate.className = 'enter-gate'; gate.tabIndex = 0; gate.setAttribute('role', 'button'); gate.setAttribute('aria-label', 'Enter the portfolio');
    gate.innerHTML = '<div><div class="loader-logo"><span>J</span>RCG</div><div class="loader-line"><span></span></div>'
      + '<p class="enter-text">Click anywhere to enter <i class="fa-solid fa-music"></i></p></div>';
    document.body.appendChild(gate);
    const text = gate.querySelector('.enter-text');
    ensure();
    const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise(r => addEventListener('load', r, { once: true }));
    loaded.then(() => setTimeout(() => {
      if (!gate) return;                                         // visitor already entered
      if (ctx.state === 'running') { startMusic(); closeGate(); } // browser allows autoplay
      else text.classList.add('show');                           // wait for the click
    }, 1500));
  } else if (musicOn) {
    ensure(); ctx.resume().then(() => { if (ctx.state === 'running') startMusic(); }).catch(() => {});
  }
  document.addEventListener('visibilitychange', () => { if (ctx) document.hidden ? ctx.suspend() : ctx.resume(); });

  /* ---------- hook the sounds to the page ---------- */
  const HOVER = 'a, button, .project, .service, .testimonial, .journey-tab, .skill';
  let lastEl = null, lastT = 0;
  if (!matchMedia('(hover: none)').matches) {
    document.addEventListener('mouseover', e => {
      const el = e.target.closest(HOVER), now = Date.now();
      if (!el || el === lastEl || now - lastT < 50) return;
      lastEl = el; lastT = now; S.hover();
    });
    document.addEventListener('mouseout', e => {
      if (lastEl && !lastEl.contains(e.relatedTarget)) lastEl = null;
    });
  }

  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#sound-toggle, #music-toggle')) return;
    if (t.closest('#theme-toggle')) return document.body.classList.contains('light') ? S.light() : S.dark();
    const star = t.closest('.star-picker label');
    if (star) return S.star([...star.parentElement.querySelectorAll('label')].indexOf(star));
    if (t.closest('.journey-tab, .filters button')) return S.tab();
    if (t.closest('#john-ai-toggle')) return document.getElementById('john-ai-window').classList.contains('open') ? S.open() : S.close();
    if (t.closest('#john-ai-close')) return S.close();
    if (t.closest('#john-ai-send')) return S.send();
    if (t.closest('a, button')) S.click();
  });

  document.addEventListener('submit', e => {
    if (e.target.matches('#contact-form, #testimonial-form')) S.success();
  }, true);

  const aiInput = document.getElementById('john-ai-input');
  if (aiInput) aiInput.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.value.trim()) S.send(); });

  const aiBody = document.getElementById('john-ai-body');
  if (aiBody) new MutationObserver(list => list.forEach(r => r.addedNodes.forEach(n => {
    if (n.classList && n.classList.contains('ai-bubble') && !n.classList.contains('user') && n.textContent !== 'Thinking...') S.pop();
  }))).observe(aiBody, { childList: true });
})();