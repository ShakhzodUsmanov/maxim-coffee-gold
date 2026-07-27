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
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


// ─── Order buttons ─────────────────────────
const orderBtns = document.querySelectorAll('#order-btn-nav, #order-btn-large, #order-btn-drawer');
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

// ─── Burger / Mobile Drawer ────────────
const burgerBtn    = document.getElementById('burger-btn');
const mobileDrawer = document.getElementById('mobile-drawer');
const drawerOverlay= document.getElementById('drawer-overlay');
const drawerClose  = document.getElementById('drawer-close');
const drawerLinks  = document.querySelectorAll('.drawer-link, #order-btn-drawer');

function openDrawer() {
  mobileDrawer.classList.add('open');
  mobileDrawer.setAttribute('aria-hidden', 'false');
  burgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  mobileDrawer.classList.remove('open');
  mobileDrawer.setAttribute('aria-hidden', 'true');
  burgerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (burgerBtn) {
  burgerBtn.addEventListener('click', openDrawer);
}
if (drawerClose) {
  drawerClose.addEventListener('click', closeDrawer);
}
if (drawerOverlay) {
  drawerOverlay.addEventListener('click', closeDrawer);
}

// Close drawer when a nav link is tapped
drawerLinks.forEach((link) => {
  link.addEventListener('click', closeDrawer);
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});

// ─── Gallery Fan / Accordion ──────────────
const galleryPanels = document.querySelectorAll('.gallery-panel');

galleryPanels.forEach((panel) => {
  panel.addEventListener('click', () => {
    galleryPanels.forEach((p) => p.classList.remove('active'));
    panel.classList.add('active');
  });

  // Also activate on mouseenter for desktop hover feel
  panel.addEventListener('mouseenter', () => {
    galleryPanels.forEach((p) => p.classList.remove('active'));
    panel.classList.add('active');
  });
});

