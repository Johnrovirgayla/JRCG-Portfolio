const DATA = {
  profile: {
    name: 'John Rovir C. Gayla',
    tagline: 'Where code meets creativity: I design interfaces, build websites, and bring 2D game ideas to life.',
    bio1: 'I am John Rovir C. Gayla, a 3rd Year Bachelor of Science in Information Technology student at PHINMA Cagayan de Oro College, taking Digital Arts as an elective. I am interested in digital design, game animation, visual creativity, UI/UX design, and software development.',
    bio2: 'I have contributed to academic system projects and created game animation content using Blender and Krita. I enjoy combining creativity and technical skills to develop engaging and user-friendly digital experiences.',
    school: 'PHINMA Cagayan de Oro College',
    phone: '0951-121-4210',
    email: 'joca.gayla.coc@phinmaed.com',
    location: 'Cagayan de Oro City, Philippines'
  },
  socials: [
    { icon: 'fa-github', title: 'GitHub', url: 'https://github.com/Johnrovirgayla' },
    { icon: 'fa-facebook', title: 'Facebook', url: 'https://www.facebook.com/share/1FkH7rMV7c' },
    { icon: 'fa-youtube', title: 'YouTube', url: 'https://www.youtube.com/channel/UCO-r6TGdRZm_DIP7bljSRUQ' },
    { icon: 'fa-linkedin', title: 'LinkedIn', url: 'https://www.linkedin.com/in/johnrovz/' }
  ],
  skills: [
    ['Blender', 80], ['Krita', 90], ['HTML & CSS', 90], ['JavaScript', 75], ['PHP & MySQL', 70],
    ['Python', 65], ['UI/UX Design (Figma)', 90]
  ],
  projects: [
    { title: '2D Game Animation Project', category: 'design', icon: 'fa-solid fa-film', description: 'Created game animation content and visual assets using Blender and Krita as part of a 2D Game Development project for 2nd Semester.', tech: 'Blender, Krita', demo: '#', code: '#' },
    { title: 'GAMIREX Game Review Website', category: 'web', icon: 'fa-solid fa-gamepad', description: 'A website that presents game information, ratings, and reviews. I contributed to the user interface, page layout, and helped organize content for easier browsing.', tech: 'HTML, CSS', demo: '#', code: '#' },
    { title: 'JRCG Portfolio', category: ['web', 'app'], icon: 'fa-solid fa-laptop-code', description: 'My personal portfolio website with a dark/light theme, scroll animations, and a built-in assistant, made as an individual project.', tech: 'HTML, CSS, JavaScript', demo: '#', code: '#' },
    { title: 'Wannabees KTV System', category: ['web', 'app'], icon: 'fa-solid fa-microphone-lines', description: 'A live web system for Wannabees Family KTV that brings room availability, orders, sales reports, inventory, and customer management into one interface. I was part of the team as a designer.', tech: 'UI/UX Design, Web System, Dashboard', demo: '#', code: '#' }
  ],
  services: [
    { title: 'Web Development', icon: 'fa-solid fa-code', description: 'Building websites with HTML, CSS, and JavaScript, like the GAMIREX game review website and my own portfolio, with clean page layouts and content that is easy to browse.', tools: 'HTML · CSS · JavaScript' },
    { title: 'UI/UX Design', icon: 'fa-solid fa-palette', description: 'Designing user interfaces, page layouts, and interface prototypes that are engaging and user-friendly, including the visual elements for my capstone project.', tools: 'Interface Layout · Prototypes' },
    { title: 'Database Systems', icon: 'fa-solid fa-database', description: 'Designing relational data models, CRUD workflows, queries, and basic administration tools.', tools: 'MySQL · SQL · XAMPP' },
    { title: '2D Game Animation & Digital Art', icon: 'fa-solid fa-film', description: 'Creating 2D game animation content, animation assets, and digital illustrations using Blender and Krita for my game development project.', tools: 'Blender · Krita' }
  ],
  experience: [
    { title: 'Digital Arts Team Member', org: 'Ongoing Capstone Project · PHINMA Cagayan de Oro College', period: '2026 – 2027', description: 'Contributing to the visual and creative aspects of the capstone project, assisting in designing visual elements, layouts, and user interface prototypes, and using digital art and design skills to improve its overall presentation.' },
    { title: 'Student Project Developer', org: 'School & Personal Projects', period: 'Ongoing', description: 'Contributing to academic system projects, building websites, and creating game animation content using Blender and Krita while practicing teamwork and attention to detail.' }
  ],
  education: [
    { title: 'Bachelor of Science in Information Technology', org: 'PHINMA - Cagayan de Oro College', period: '2023 - Present', description: 'Now in 3rd Year with Digital Arts as an elective, developing programming, software development, UI/UX, and digital art skills through coursework and projects.' },
    { title: 'Senior High School - STEM Student', org: 'PHINMA - Cagayan de Oro College', period: '2022 - 2024', description: 'Completed the Science, Technology, Engineering, and Mathematics (STEM) strand, developing foundational skills in mathematics, science, research, analytical thinking, and problem-solving. Graduated With Honor.' },
    { title: 'Certificate of Excellence — Top 1 Ranking (Period 2)', org: 'ITE 353: Data Scalability and Analytics', period: '2026', description: 'Ranked 1st in Period 2 of ITE 353: Data Scalability and Analytics.' },
    { title: 'Certificate of Excellence — Top 3 Ranking (Period 1)', org: 'ITE 353: Data Scalability and Analytics', period: '2026', description: 'Ranked in the top 3 in Period 1 of ITE 353: Data Scalability and Analytics.' }
  ],
  testimonials: [
    { name: 'Kiezel Mae C. Ranile', role: 'Portfolio Viewer', rating: 5, message: 'Great portfolio! The design is clean, responsive, and easy to explore.' }
  ]
};

const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

$$('[data-bind]').forEach(el => el.textContent = DATA.profile[el.dataset.bind]);
$$('[data-socials]').forEach(el => el.innerHTML = DATA.socials.map(s =>
  `<a href="${s.url}" target="_blank" rel="noopener" title="${s.title}"><i class="fa-brands ${s.icon}"></i></a>`).join(''));
$('#year').textContent = new Date().getFullYear();
$('#stat-projects').textContent = DATA.projects.length;
$('#stat-tech').textContent = Math.max(10, DATA.skills.length + 4) + '+';

$('#skill-list').innerHTML = DATA.skills.map(([n, p]) =>
  `<div class="skill"><div><b>${esc(n)}</b><span>${p}%</span></div><div class="bar"><i style="width:0" data-w="${p}%"></i></div></div>`).join('');

$('#project-grid').innerHTML = DATA.projects.map(x => {
  const categories = Array.isArray(x.category) ? x.category : [x.category];
  const categoryLabel = categories.map(c => c.toUpperCase()).join(' / ');
  const categoryValue = categories.join(' ');
  return `
  <article class="project" data-category="${categoryValue}">
    <div class="project-top"><i class="${x.icon}"></i><span>${categoryLabel}</span></div>
    <h3>${esc(x.title)}</h3><p>${esc(x.description)}</p>
    <div class="tags">${x.tech.split(',').map(t => `<span>${esc(t.trim())}</span>`).join('')}</div>
    <div class="project-links">
      ${x.demo !== '#' ? `<a href="${x.demo}" target="_blank" rel="noopener">Demo <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
      ${x.code !== '#' ? `<a href="${x.code}" target="_blank" rel="noopener">Code <i class="fa-brands fa-github"></i></a>` : ''}
    </div>
  </article>`;
}).join('');

$('#service-grid').innerHTML = DATA.services.map(s => `
  <article class="service"><div class="service-icon"><i class="${s.icon}"></i></div>
  <h3>${esc(s.title)}</h3><p>${esc(s.description)}</p><small>${esc(s.tools)}</small></article>`).join('');

const timeline = list => list.map(x => `
  <article><div class="dot"></div><div class="time">${esc(x.period)}</div>
  <h3>${esc(x.title)}</h3><h4>${esc(x.org)}</h4><p>${esc(x.description)}</p></article>`).join('');
$('#tl-experience').innerHTML = timeline(DATA.experience);
$('#tl-education').innerHTML = timeline(DATA.education);

let saved = [];
try { saved = JSON.parse(localStorage.getItem('jrcg-testimonials') || '[]'); } catch (e) {}
function renderTestimonials() {
  const all = [...saved, ...DATA.testimonials];
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  all.forEach(t => counts[t.rating]++);
  const total = all.length, avg = total ? all.reduce((a, t) => a + t.rating, 0) / total : 0;
  let rows = '';
  for (let r = 5; r >= 1; r--) {
    const pct = total ? Math.round(counts[r] / total * 100) : 0;
    rows += `<div class="rating-row"><span>${r} <i class="fa-solid fa-star"></i></span><div class="rating-bar"><i style="width:${pct}%"></i></div><b>${counts[r]}</b></div>`;
  }
  $('#rating-card').innerHTML = `<div class="rating-summary"><strong>${avg.toFixed(1)}</strong><div class="stars">★★★★★</div><small>Based on ${total} rating${total === 1 ? '' : 's'}</small></div>${rows}`;
  $('#testimonial-list').innerHTML = all.length ? all.map(t => `
    <article class="testimonial reveal revealed">
      <div class="testimonial-head"><div class="avatar">${esc(t.name[0].toUpperCase())}</div>
      <div><h3>${esc(t.name)}</h3><small>${esc(t.role || '')}</small></div>
      <div class="testimonial-stars">${'★'.repeat(t.rating)}<span>${'★'.repeat(5 - t.rating)}</span></div></div>
      <p>${esc(t.message)}</p></article>`).join('')
    : '<div class="empty-testimonial">No testimonials yet. Be the first to leave a rating!</div>';
}
renderTestimonials();

const picker = $('#star-picker');
for (let r = 1; r <= 5; r++) picker.insertAdjacentHTML('beforeend',
  `<input type="radio" id="rate${r}" name="rating" value="${r}" ${r === 5 ? 'checked' : ''}><label for="rate${r}" title="${r} star${r > 1 ? 's' : ''}">★</label>`);
const paintStars = () => {
  const v = +picker.querySelector('input:checked').value;
  picker.querySelectorAll('label').forEach((l, i) => l.classList.toggle('on', i < v));
};
picker.addEventListener('change', paintStars); paintStars();

function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 3200);
}
$('#testimonial-form').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  saved.unshift({ name: f.get('name').trim(), role: f.get('role').trim(), rating: +f.get('rating'), message: f.get('message').trim() });
  try { localStorage.setItem('jrcg-testimonials', JSON.stringify(saved)); } catch (err) {}
  renderTestimonials(); e.target.reset(); paintStars();
  toast('Thanks! Your testimonial was added.');
});

$('#contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`;
  location.href = `mailto:${DATA.profile.email}?subject=${encodeURIComponent(f.get('subject'))}&body=${encodeURIComponent(body)}`;
  toast('Opening your email app...');
});

window.addEventListener('load', () => setTimeout(() => $('.loader')?.classList.add('hide'), 700));
window.addEventListener('scroll', () => $('#navbar')?.classList.toggle('scrolled', scrollY > 30));

const mobile = $('#mobile-menu');
$('#menu').addEventListener('click', () => mobile.classList.add('open'));
$('#close-menu').addEventListener('click', () => mobile.classList.remove('open'));
$$('#mobile-menu a').forEach(a => a.addEventListener('click', () => mobile.classList.remove('open')));

const themeBtn = $('#theme-toggle');
const paintTheme = () => themeBtn.innerHTML = `<i class="fa-solid fa-${document.body.classList.contains('light') ? 'sun' : 'moon'}"></i>`;
try { if (localStorage.getItem('jrcg-theme') === 'light') document.body.classList.add('light'); } catch (e) {}
paintTheme();
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  try { localStorage.setItem('jrcg-theme', document.body.classList.contains('light') ? 'light' : 'dark'); } catch (e) {}
  paintTheme();
});

const words = ['UI/UX Designer 🎨', 'Digital Arts Student 🖌️', 'Game Animation Creator 🎮', 'Web Developer 💻', '3rd Year IT Student 🎓'];
let wi = 0, ci = 0, del = false;
(function type() {
  const el = $('#typing'), w = [...words[wi]];
  el.textContent = w.slice(0, ci).join('');
  if (!del) { ci++; if (ci > w.length) { del = true; return setTimeout(type, 1200); } }
  else { ci--; if (ci < 0) { ci = 0; del = false; wi = (wi + 1) % words.length; } }
  setTimeout(type, del ? 45 : 85);
})();

$$('.filters button').forEach(btn => btn.addEventListener('click', () => {
  $$('.filters button').forEach(x => x.classList.remove('active')); btn.classList.add('active');
  const f = btn.dataset.filter;
  $$('.project').forEach(p => {
    const categories = p.dataset.category ? p.dataset.category.split(' ') : [];
    p.style.display = f === 'all' || categories.includes(f) ? 'block' : 'none';
  });
}));
$$('.journey-tab').forEach(btn => btn.addEventListener('click', () => {
  $$('.journey-tab').forEach(x => x.classList.remove('active')); btn.classList.add('active');
  $$('.journey-panel').forEach(p => p.classList.toggle('active', p.id === 'journey-' + btn.dataset.journey));
}));

const sections = [...$$('section[id]')], navLinks = [...$$('#navbar .links a, #mobile-menu a')];
const activateNav = () => {
  let current = 'home';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 150) current = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
};
window.addEventListener('scroll', activateNav, { passive: true }); activateNav();

const revealObserver = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('revealed');
  e.target.querySelectorAll('.bar i[data-w]').forEach(b => b.style.width = b.dataset.w);
  revealObserver.unobserve(e.target);
}), { threshold: .12 });
$$('section .container, .project, .service, .testimonial, .rating-card').forEach(el => {
  if (!el.classList.contains('revealed')) el.classList.add('reveal');
  revealObserver.observe(el);
});

const aiWin = $('#john-ai-window'), aiBody = $('#john-ai-body'), aiInput = $('#john-ai-input'), aiSend = $('#john-ai-send');
const aiBubble = (text, who = 'bot') => {
  const d = document.createElement('div'); d.className = 'ai-bubble ' + who; d.textContent = text;
  aiBody.appendChild(d); aiBody.scrollTop = aiBody.scrollHeight; return d;
};
function aiAnswer(q) {
  q = q.toLowerCase(); const p = DATA.profile, has = (...k) => k.some(w => q.includes(w));
  if (has('hello', 'hi ', 'hey') || q === 'hi') return "Hello! 👋 Ask me about John's education, skills, projects, services, or how to contact him.";
  if (has('educat', 'school', 'study', 'course', 'degree', 'college')) return `John is taking a ${DATA.education[0].title} at ${p.school} (${DATA.education[0].period}).`;
  if (has('experience', 'work', 'job')) return DATA.experience.map(x => `${x.title} — ${x.org} (${x.period})`).join('. ') + '.';
  if (has('skill', 'tech', 'language', 'know', 'good at')) return 'His skills: ' + DATA.skills.map(([n, v]) => `${n} (${v}%)`).join(', ') + '.';
  if (has('project', 'built', 'made', 'portfolio')) return 'Projects: ' + DATA.projects.map(x => x.title).join(', ') + '.';
  if (has('service', 'offer', 'hire', 'freelance', 'do you do')) return 'He offers: ' + DATA.services.map(x => `${x.title} (${x.tools})`).join('; ') + '.';
  if (has('contact', 'email', 'phone', 'number', 'reach', 'location', 'where', 'live')) return `Email: ${p.email}. Phone: ${p.phone}. Location: ${p.location}.`;
  if (has('cv', 'resume')) return 'You can grab his CV with the "Download CV" button at the top of the page.';
  if (has('who', 'about', 'goal', 'passion', 'name')) return p.bio1 + ' ' + p.bio2;
  return "I'm not sure about that one. Try asking about his education, experience, skills, projects, services, or contact details.";
}
function aiStart() {
  if (aiBody.dataset.started) return; aiBody.dataset.started = '1';
  aiBubble("Hi! I'm John Ai 🤖, an AI Assistant. Ask me anything about John based on his portfolio.");
  aiBubble('You can ask about his education, experience, skills, projects, services, contact details, or goals.');
}
$('#john-ai-toggle').addEventListener('click', () => {
  aiWin.classList.toggle('open');
  if (aiWin.classList.contains('open')) { aiStart(); setTimeout(() => aiInput.focus(), 150); }
});
$('#john-ai-close').addEventListener('click', () => aiWin.classList.remove('open'));
function aiAsk() {
  const v = aiInput.value.trim(); if (!v) return;
  aiBubble(v, 'user'); aiInput.value = ''; aiSend.disabled = true;
  const thinking = aiBubble('Thinking...');
  setTimeout(() => { thinking.remove(); aiBubble(aiAnswer(v)); aiSend.disabled = false; aiInput.focus(); }, 500);
}
aiSend.addEventListener('click', aiAsk);
aiInput.addEventListener('keydown', e => { if (e.key === 'Enter') aiAsk(); });
