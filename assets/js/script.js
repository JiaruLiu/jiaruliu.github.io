/* ============================================
   Jiaru Liu — Portfolio Scripts
   ============================================ */

// ── Hero particle canvas ─────────────────────
const cv  = document.getElementById('hcanvas');
const ctx = cv.getContext('2d');
let W, H;

function rsz() { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; }
rsz();
window.addEventListener('resize', rsz);

const NN = 22;
const ns = Array.from({ length: NN }, () => ({
  x:  Math.random() * 1600,
  y:  Math.random() * 900,
  vx: (Math.random() - .5) * .28,
  vy: (Math.random() - .5) * .28,
  r:  Math.random() * 2.5 + 1.8,
  ph: Math.random() * Math.PI * 2,
  w:  Math.random() > .72
}));
const pks = [];

function spk() {
  const a = Math.floor(Math.random() * NN);
  let   b = Math.floor(Math.random() * NN);
  if (b === a) b = (a + 1) % NN;
  const dx = ns[a].x - ns[b].x, dy = ns[a].y - ns[b].y;
  if (Math.sqrt(dx*dx + dy*dy) > 280) return;
  pks.push({ a, b, t: 0, sp: .005 + Math.random() * .008, w: Math.random() > .65 });
}
setInterval(spk, 320);

function drw() {
  ctx.clearRect(0, 0, W, H);
  const t = performance.now() * .001, sx = W / 1600, sy = H / 900;

  // move nodes
  ns.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > 1600) n.vx *= -1;
    if (n.y < 0 || n.y > 900)  n.vy *= -1;
  });

  // connection lines
  for (let i = 0; i < NN; i++) {
    for (let j = i + 1; j < NN; j++) {
      const dx = ns[i].x - ns[j].x, dy = ns[i].y - ns[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 280) {
        ctx.beginPath();
        ctx.moveTo(ns[i].x * sx, ns[i].y * sy);
        ctx.lineTo(ns[j].x * sx, ns[j].y * sy);
        ctx.strokeStyle = `rgba(97,89,224,${(1 - d/280) * .12})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // travelling sparks
  for (let i = pks.length - 1; i >= 0; i--) {
    const p = pks[i];
    p.t += p.sp;
    if (p.t >= 1) { pks.splice(i, 1); continue; }
    const na = ns[p.a], nb = ns[p.b];
    const x  = (na.x + (nb.x - na.x) * p.t) * sx;
    const y  = (na.y + (nb.y - na.y) * p.t) * sy;
    const xt = (na.x + (nb.x - na.x) * Math.max(0, p.t - .07)) * sx;
    const yt = (na.y + (nb.y - na.y) * Math.max(0, p.t - .07)) * sy;
    const col = p.w ? '232,148,90' : '97,89,224';
    ctx.beginPath(); ctx.moveTo(xt, yt); ctx.lineTo(x, y);
    ctx.strokeStyle = `rgba(${col},.5)`; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${col},.85)`; ctx.fill();
  }

  // nodes
  ns.forEach(n => {
    const pl  = Math.sin(t * 1.1 + n.ph) * .5 + .5;
    const x   = n.x * sx, y = n.y * sy;
    const col = n.w ? '232,148,90' : '97,89,224';
    ctx.beginPath();
    ctx.arc(x, y, n.r + pl * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${col},.5)`;
    ctx.fill();
  });

  requestAnimationFrame(drw);
}
drw();

// ── Hero blob mouse parallax ──────────────────
const blobs = document.querySelectorAll('.hblob');
const isTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouch()) {
  document.addEventListener('mousemove', e => {
    const nx = (e.clientX / innerWidth  - .5) * 2;
    const ny = (e.clientY / innerHeight - .5) * 2;
    blobs.forEach(b => {
      const d = parseFloat(b.dataset.d) || 1;
      b.style.transform = `translate(${nx * d * 18}px, ${ny * d * 14}px)`;
    });
  });
}

// ── Skills marquee ────────────────────────────
const mqItems = [
  { l: 'Python',          c: '#6159E0' },
  { l: 'SQL',             c: '#6159E0' },
  { l: 'PySpark',         c: '#6159E0' },
  { l: 'Bash',            c: '#6159E0' },
  { l: 'AWS',             c: '#0891B2' },
  { l: 'GCP',             c: '#0891B2' },
  { l: 'Databricks',      c: '#0891B2' },
  { l: 'Snowflake',       c: '#0891B2' },
  { l: 'Airflow',         c: '#52B788' },
  { l: 'dbt',             c: '#52B788' },
  { l: 'Kinesis',         c: '#52B788' },
  { l: 'Spark Streaming', c: '#52B788' },
  { l: 'Redshift',        c: '#E8945A' },
  { l: 'MongoDB',         c: '#E8945A' },
  { l: 'Delta Lake',      c: '#E8945A' },
  { l: 'Terraform',       c: '#8B7FF8' },
  { l: 'Docker',          c: '#8B7FF8' },
  { l: 'CI/CD',           c: '#8B7FF8' },
  { l: 'MLOps',           c: '#6159E0' },
  { l: 'LLM Pipelines',   c: '#6159E0' },
];

const mqt    = document.getElementById('mqt');
const mqHTML = mqItems.map(i =>
  `<span class="mi"><span class="midot" style="background:${i.c}"></span>${i.l}</span>`
).join('');
mqt.innerHTML = mqHTML + mqHTML; // duplicate for seamless loop

// ── Word-reveal on section titles ─────────────
document.querySelectorAll('.rtitle[data-sp]').forEach(el => {
  el.innerHTML = el.textContent.trim()
    .split(/\s+/)
    .map(w => `<span class="w"><span class="wi">${w}</span></span>`)
    .join(' ');
});

const rtObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('rev');
      e.target.querySelectorAll('.wi').forEach((s, i) => {
        s.style.transitionDelay = `${i * .08}s`;
      });
      rtObs.unobserve(e.target);
    }
  });
}, { threshold: .3 });

document.querySelectorAll('.rtitle[data-sp]').forEach(el => rtObs.observe(el));

// ── General fade-in on scroll ─────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
}, { threshold: .08 });
document.querySelectorAll('.fi').forEach(el => io.observe(el));

// ── 3D tilt on project cards (desktop) ────────
if (!isTouch()) {
  document.querySelectorAll('.proj-card').forEach(c => {
    c.addEventListener('mouseenter', () => {
      c.style.transition = 'box-shadow .2s, border-color .2s';
    });
    c.addEventListener('mouseleave', () => {
      c.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1), box-shadow .3s, border-color .2s';
      c.style.transform  = '';
    });
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) / r.width;
      const y = (e.clientY - r.top  - r.height / 2) / r.height;
      c.style.transform = `perspective(700px) rotateY(${x*10}deg) rotateX(${-y*8}deg) translateZ(10px)`;
    });
  });
}

// ── Nav: scroll shadow + active link highlight ─
const navbar = document.getElementById('navbar');
const ni     = navbar.querySelector('.nav-inner');
const sects  = document.querySelectorAll('section[id], div[id]');
const navAs  = document.querySelectorAll('.nlinks a');

window.addEventListener('scroll', () => {
  const scrolled = scrollY > 20;
  ni.style.boxShadow   = scrolled ? '0 8px 32px rgba(23,22,15,.1)'  : '0 4px 24px rgba(23,22,15,.06)';
  ni.style.borderColor = scrolled ? 'rgba(97,89,224,.25)'           : 'var(--border)';
}, { passive: true });

const spyObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.getAttribute('id');
      navAs.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--accent)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sects.forEach(s => spyObs.observe(s));

// ── Hamburger mobile menu ─────────────────────
const hbg = document.getElementById('hbg');
const nl  = document.getElementById('nlinks');

if (hbg && nl) {
  hbg.addEventListener('click', () => {
    hbg.classList.toggle('open');
    nl.classList.toggle('open');
  });
  nl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hbg.classList.remove('open');
      nl.classList.remove('open');
    });
  });
}

// ── Smooth scroll for anchor links ───────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
