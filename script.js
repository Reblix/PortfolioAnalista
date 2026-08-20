(() => {
  'use strict';

  const doc = document.documentElement;
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('.scroll-progress span');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
  const activeParallaxItems = new Set();
  let ticking = false;

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const setMenu = (open) => {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('.sr-only').textContent = open ? 'Fechar menu' : 'Abrir menu';
    menu.classList.toggle('is-open', open);
    body.classList.toggle('menu-open', open);
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) setMenu(false);
    requestTick();
  }, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08
    });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if ('IntersectionObserver' in window && parallaxItems.length) {
    const parallaxObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeParallaxItems.add(entry.target);
        else activeParallaxItems.delete(entry.target);
      });
      requestTick();
    }, { rootMargin: '20% 0px 20% 0px' });

    parallaxItems.forEach((item) => parallaxObserver.observe(item));
  } else {
    parallaxItems.forEach((item) => activeParallaxItems.add(item));
  }

  const sectionLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, {
      rootMargin: '-35% 0px -55% 0px',
      threshold: 0
    });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const renderScrollEffects = () => {
    const scrollTop = window.scrollY || doc.scrollTop;
    const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);

    header?.classList.toggle('is-scrolled', scrollTop > 12);
    if (progress) progress.style.transform = `scaleX(${clamp(scrollTop / maxScroll, 0, 1)})`;

    if (!reduceMotion.matches) {
      const viewportCenter = window.innerHeight / 2;
      activeParallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const factor = Number.parseFloat(item.dataset.parallax || '0');
        const distance = rect.top + rect.height / 2 - viewportCenter;
        const offset = clamp(distance * factor, -64, 64);
        item.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
      });
    }

    ticking = false;
  };

  function requestTick() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(renderScrollEffects);
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  reduceMotion.addEventListener?.('change', () => {
    if (reduceMotion.matches) {
      parallaxItems.forEach((item) => item.style.removeProperty('--parallax-y'));
    }
    requestTick();
  });

  document.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => {
      image.closest('.browser-frame, .device-frame, .portrait-frame')?.classList.add('media-unavailable');
    }, { once: true });
  });

  requestTick();
})();

