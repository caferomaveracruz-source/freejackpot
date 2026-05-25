class Slider {
  constructor(el) {
    this.container = el.querySelector('.slider-container');
    this.slides = el.querySelectorAll('.slide');
    this.dots = el.querySelectorAll('.dot');
    this.current = 0;
    this.total = this.slides.length;

    el.querySelector('.slider-arrow.prev')?.addEventListener('click', () => this.prev());
    el.querySelector('.slider-arrow.next')?.addEventListener('click', () => this.next());
    this.dots.forEach((d, i) => d.addEventListener('click', () => this.goTo(i)));

    let touchStart = 0;
    el.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', e => {
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? this.next() : this.prev();
    });

    setInterval(() => this.next(), 10000);
  }

  step() {
    return window.innerWidth >= 769 ? 50 : 100;
  }

  goTo(index) {
    this.current = (index + this.total) % this.total;
    this.container.style.transform = `translateX(-${this.current * this.step()}%)`;
    this.dots.forEach((d, i) => d.classList.toggle('active', i === this.current));
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }
}

function initSlider() {
  const el = document.getElementById('mainSlider');
  if (el) new Slider(el);
}

function initNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

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

document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initNav();
  initFavButtons();
  initSearch();
  setTimeout(initAnimations, 100);
});
