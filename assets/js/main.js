/* ============================================
   CASINO MAIN JS
   ============================================ */

// ── MOBILE SLIDER ────────────────────────────
class MobileSlider {
  constructor(el) {
    this.section = el;
    this.container = el.querySelector('.slider-container');
    this.slides = el.querySelectorAll('.slide');
    this.dots = el.querySelectorAll('.dot');
    this.current = 0;
    this.total = this.slides.length;
    this.autoplayInterval = null;

    el.querySelector('.slider-arrow.prev')?.addEventListener('click', () => this.prev());
    el.querySelector('.slider-arrow.next')?.addEventListener('click', () => this.next());
    this.dots.forEach((d, i) => d.addEventListener('click', () => this.goTo(i)));

    // Touch swipe
    let touchStart = 0;
    el.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', e => {
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? this.next() : this.prev();
    });

    this.startAutoplay();
    el.addEventListener('mouseenter', () => this.stopAutoplay());
    el.addEventListener('mouseleave', () => this.startAutoplay());
  }

  goTo(index) {
    this.current = (index + this.total) % this.total;
    this.container.style.transform = `translateX(-${this.current * 100}%)`;
    this.dots.forEach((d, i) => d.classList.toggle('active', i === this.current));
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }
  startAutoplay() { this.autoplayInterval = setInterval(() => this.next(), 10000); }
  stopAutoplay() { clearInterval(this.autoplayInterval); }
}

// ── INIT SLIDER ──────────────────────────────
function initSlider() {
  const el = document.getElementById('mainSlider');
  if (!el) return;

  // Solo activa el slider JS en mobile
  const mq = window.matchMedia('(max-width: 768px)');
  let sliderInstance = null;

  function setup(mobile) {
    if (mobile) {
      if (!sliderInstance) sliderInstance = new MobileSlider(el);
    } else {
      // En desktop, detener el autoplay si existía
      if (sliderInstance) {
        sliderInstance.stopAutoplay();
        sliderInstance = null;
        // Reset transform por si acaso
        el.querySelector('.slider-container').style.transform = '';
      }
    }
  }

  setup(true);

}

// ── NAV ITEMS ────────────────────────────────
function initNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

// ── FAVE BUTTON ──────────────────────────────
function initFavButtons() {
  document.querySelectorAll('.game-fav').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isFav = btn.textContent.trim() === '♥';
      btn.textContent = isFav ? '♡' : '♥';
      btn.style.color = isFav ? '' : '#e91e8c';
    });
  });
}

// ── SEARCH ───────────────────────────────────
function initSearch() {
  const input = document.querySelector('.search-bar input');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    document.querySelectorAll('.game-card, .game-card-placeholder').forEach(card => {
      const label = card.querySelector('.placeholder-label, img')?.alt || '';
      card.style.display = q && !label.toLowerCase().includes(q) ? 'none' : '';
    });
  });
}

// ── ENTRY ANIMATIONS ─────────────────────────
function initAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.game-card, .game-card-placeholder').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.4s ease ${i * 0.04}s, transform 0.4s ease ${i * 0.04}s`;
    observer.observe(card);
  });
}

// ── BOOT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initNav();
  initFavButtons();
  initSearch();
  setTimeout(initAnimations, 100);
});
