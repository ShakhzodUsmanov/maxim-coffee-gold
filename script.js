/* ======================================
   MAXIM COFFEE — JavaScript Interactions
   ====================================== */

'use strict';

// ─── Scroll Reveal ───────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ─── Auto-add reveal class to key sections ───
const revealTargets = [
  '.big-text-line',
  '.coffee-pill',
  '.beans-title',
  '.beans-subtitle',
  '.order-btn-large',
  '.categories-title',
  '.side-product-card',
  '.our-coffee-title',
];

revealTargets.forEach((selector) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 60}ms`;
    revealObserver.observe(el);
  });
});

// ─── Navbar Scroll Effect ─────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.style.background = 'rgba(15,45,30,0.92)';
    navbar.style.backdropFilter = 'blur(12px)';
    navbar.style.borderBottom = '1px solid rgba(245,197,24,0.15)';
    navbar.style.position = 'fixed';
    navbar.style.top = '0';
    navbar.style.left = '0';
    navbar.style.right = '0';
    navbar.style.zIndex = '999';
  } else {
    navbar.style.background = 'transparent';
    navbar.style.backdropFilter = 'none';
    navbar.style.borderBottom = 'none';
    navbar.style.position = 'relative';
  }
}, { passive: true });


// ─── Order buttons ─────────────────────────
const orderBtns = document.querySelectorAll('#order-btn-nav, #order-btn-large');
orderBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    // ripple effect
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      background:rgba(255,255,255,0.35);
      width:60px; height:60px;
      transform:scale(0); animation:ripple 0.55s linear;
      top:50%; left:50%; margin:-30px 0 0 -30px;
      pointer-events:none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// inject ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to { transform: scale(3); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ─── Coffee Pills hover 3D tilt ───────────
document.querySelectorAll('.coffee-pill').forEach((pill) => {
  pill.addEventListener('mouseenter', (e) => {
    pill.style.boxShadow = '0 8px 24px rgba(27,67,50,0.2)';
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.boxShadow = '';
  });
});

// ─── Parallax for hero product ───────────
const heroProduct = document.getElementById('hero-product');
if (heroProduct) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroSection = document.getElementById('hero');
    if (heroSection && scrolled < heroSection.offsetHeight) {
      heroProduct.style.transform = `translateX(-50%) translateY(${scrolled * 0.25}px)`;
    }
  }, { passive: true });
}

// ─── Ticker pause on hover (ribbons) ─────
document.querySelectorAll('.ticker-ribbon').forEach((ribbon) => {
  ribbon.addEventListener('mouseenter', () => {
    ribbon.querySelectorAll('.ticker-track').forEach(t => t.style.animationPlayState = 'paused');
  });
  ribbon.addEventListener('mouseleave', () => {
    ribbon.querySelectorAll('.ticker-track').forEach(t => t.style.animationPlayState = 'running');
  });
});

// ─── Toggle switch interaction ────────────
const toggleSwitch = document.getElementById('toggle-switch');
if (toggleSwitch) {
  let toggled = true;
  toggleSwitch.addEventListener('click', () => {
    toggled = !toggled;
    const knob = toggleSwitch.querySelector('.toggle-knob');
    if (toggled) {
      knob.style.marginLeft = 'auto';
      knob.style.marginRight = '';
    } else {
      knob.style.marginLeft = '';
      knob.style.marginRight = 'auto';
    }
  });
}

// ─── Animate numbers on price ──────────────
function animateValue(el, start, end, duration) {
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (start + (end - start) * eased).toFixed(2);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const priceBig = document.getElementById('price-big');
if (priceBig) {
  const priceObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateValue(priceBig, 0, 5.0, 1200);
      priceObserver.disconnect();
    }
  });
  priceObserver.observe(priceBig);
}

console.log('%c☕ MAXIM COFFEE — Life begins after flavour',
  'color:#F5C518; font-size:16px; font-weight:bold; background:#0F2D1E; padding:10px 20px; border-radius:8px;');
