/* ===== NAV SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== BURGER ===== */
const burger    = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navMobile.classList.toggle('open');
  document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.nav-mobile a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navMobile.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===== SCROLL REVEAL ===== */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => obs.observe(el));

/* ===== ANIMATED COUNTERS ===== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 16);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = '1';
      animateCounter(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObs.observe(el));

/* ===== COUNTDOWN TIMER ===== */
function updateTimer() {
  const el = document.getElementById('countdown');
  if (!el) return;
  const now  = new Date();
  const end  = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const diff = end - now;
  if (diff <= 0) { el.textContent = 'Акция завершена'; return; }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000)  / 60000);
  const s = Math.floor((diff % 60000)    / 1000);
  el.textContent = `${d}д ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
updateTimer();
setInterval(updateTimer, 1000);

/* ===== SCHEDULE FILTER ===== */
const schedBtns  = document.querySelectorAll('.sched-btn');
const schedItems = document.querySelectorAll('.sched-item');

schedBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    schedBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const day = btn.dataset.day;
    schedItems.forEach(item => {
      item.style.display = (day === 'all' || item.dataset.day === day) ? '' : 'none';
    });
  });
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  });
});

/* ===== BOOKING FORM ===== */
const form       = document.getElementById('bookingForm');
const formOk     = document.getElementById('formOk');

function setErr(id, msg) {
  const el = document.getElementById(id);
  const er = document.getElementById(id + 'Err');
  if (el) el.classList.add('error');
  if (er) { er.textContent = msg; er.classList.add('show'); }
}
function clearErr(id) {
  const el = document.getElementById(id);
  const er = document.getElementById(id + 'Err');
  if (el) el.classList.remove('error');
  if (er) er.classList.remove('show');
}

['bName','bPhone','bPlan'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearErr(id));
});

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    const name  = document.getElementById('bName').value.trim();
    const phone = document.getElementById('bPhone').value.trim();
    const plan  = document.getElementById('bPlan').value;

    if (name.length < 2)  { setErr('bName',  'Введите ваше имя');         ok = false; } else clearErr('bName');
    if (!/^[\d\s\+\-\(\)]{7,20}$/.test(phone)) { setErr('bPhone', 'Некорректный номер'); ok = false; } else clearErr('bPhone');
    if (!plan) { setErr('bPlan', 'Выберите абонемент'); ok = false; } else clearErr('bPlan');

    if (!ok) return;

    const bookings = JSON.parse(localStorage.getItem('apex_bookings') || '[]');
    bookings.push({
      id: Date.now(), name, phone, plan,
      comment: document.getElementById('bComment').value.trim(),
      date: new Date().toLocaleString('ru')
    });
    localStorage.setItem('apex_bookings', JSON.stringify(bookings));

    form.reset();
    form.style.display = 'none';
    formOk.classList.add('show');
  });
}
