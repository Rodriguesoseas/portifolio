document.documentElement.classList.add('js');

const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-link');

function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}

function toggleMenu() {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
}

function closeMenu() {
  navToggle.classList.remove('active');
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

navToggle.addEventListener('click', toggleMenu);

navAnchors.forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    closeMenu();
  }
});

const revealSections = document.querySelectorAll('.section, .hero');

const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal', 'show');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

revealSections.forEach(section => {
  if (!section.classList.contains('hero')) {
    section.classList.add('reveal');
    observer.observe(section);
  }
});

const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
  card.classList.add('reveal');
  observer.observe(card);
});

const skillItems = document.querySelectorAll('.skill-item');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillItems.forEach((item, i) => {
  item.style.setProperty('--reveal-delay', `${i * 80}ms`);
  skillObserver.observe(item);
});

function updateActiveSection() {
  const scrollPos = window.scrollY + 120;
  const sections = document.querySelectorAll('section[id]');

revealSections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);

    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveSection, { passive: true });
updateActiveSection();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateParallax() {
  if (reducedMotion.matches) return;
  const photo = document.querySelector('.hero-parallax');
  if (!photo) return;
  const rect = photo.getBoundingClientRect();
  const centerY = rect.top + rect.height / 2;
  const viewCenter = window.innerHeight / 2;
  const offset = (centerY - viewCenter) * 0.04;
  photo.style.transform = `translateY(${offset}px)`;
}

window.addEventListener('scroll', updateParallax, { passive: true });
updateParallax();

const skillsWrapper = document.getElementById('skillsWrapper');
const skillsBar = document.getElementById('skillsBar');
const fadeLeft = document.querySelector('.skills-fade-left');
const fadeRight = document.querySelector('.skills-fade-right');

if (skillsWrapper && skillsBar) {
  let rafId = null;
  let currentScroll = skillsBar.scrollLeft;
  let targetScroll = skillsBar.scrollLeft;

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function safeMaxScroll() {
    return Math.max(0, skillsBar.scrollWidth - skillsBar.clientWidth);
  }

  function updateScroll() {
    currentScroll = lerp(currentScroll, targetScroll, 0.12);
    if (Math.abs(currentScroll - targetScroll) > 0.5) {
      skillsBar.scrollLeft = currentScroll;
      rafId = requestAnimationFrame(updateScroll);
    } else {
      skillsBar.scrollLeft = targetScroll;
      currentScroll = targetScroll;
      rafId = null;
    }
    updateFades();
  }

  function updateFades() {
    const maxScroll = safeMaxScroll();
    if (fadeLeft) fadeLeft.style.opacity = skillsBar.scrollLeft > 10 ? '1' : '0';
    if (fadeRight) fadeRight.style.opacity = skillsBar.scrollLeft < maxScroll - 10 ? '1' : '0';
  }

  skillsWrapper.addEventListener('mouseenter', () => {
    updateFades();
  });

  skillsWrapper.addEventListener('mousemove', (e) => {
    const maxScroll = safeMaxScroll();
    if (maxScroll <= 0) return;
    const rect = skillsWrapper.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    targetScroll = percentage * maxScroll;
    skillsWrapper.classList.add('active');
    if (!rafId) {
      rafId = requestAnimationFrame(updateScroll);
    }
  });

  skillsWrapper.addEventListener('mouseleave', () => {
    skillsWrapper.classList.remove('active');
    targetScroll = skillsBar.scrollLeft;
    currentScroll = skillsBar.scrollLeft;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (fadeLeft) fadeLeft.style.opacity = '0';
    if (fadeRight) fadeRight.style.opacity = '0';
  });

  let touchStartX = 0;
  let touchStartScroll = 0;

  skillsWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartScroll = skillsBar.scrollLeft;
  }, { passive: true });

  skillsWrapper.addEventListener('touchmove', (e) => {
    const dx = touchStartX - e.touches[0].clientX;
    skillsBar.scrollLeft = touchStartScroll + dx;
    updateFades();
  }, { passive: true });

  skillsWrapper.addEventListener('touchend', () => {
    if (fadeLeft) fadeLeft.style.opacity = '0';
    if (fadeRight) fadeRight.style.opacity = '0';
  }, { passive: true });
}

function initCarousel(root, slidesPerView = 1) {
  if (!root) return;
  const track = root.querySelector('.v-track');
  const slides = Array.from(root.querySelectorAll(':scope > .v-track > .v-slide'));
  const prevBtn = root.querySelector('.v-prev');
  const nextBtn = root.querySelector('.v-next');
  const dotsWrap = root.querySelector('.v-dots');
  const AUTOPLAY_MS = 3500;
  const STEP = 100 / slidesPerView;
  const TOTAL = slides.length;
  const CLONES = slidesPerView;
  const REAL_START = CLONES;
  let index = REAL_START;
  let autoplayId = null;
  let inView = true;

  const headClones = slides.slice(-CLONES).map(s => s.cloneNode(true));
  const tailClones = slides.slice(0, CLONES).map(s => s.cloneNode(true));
  [...headClones, ...tailClones].forEach(clone => {
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach(im => { im.loading = 'eager'; });
  });
  [...headClones].reverse().forEach(clone => {
    track.prepend(clone);
  });
  tailClones.forEach(clone => {
    track.append(clone);
  });

  const allSlides = Array.from(track.children);
  const ANIM_MAX = allSlides.length - CLONES;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'v-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('tabindex', i === 0 ? '0' : '-1');
    dot.setAttribute('aria-label', `Imagem ${i + 1} de ${slides.length}`);
    dot.addEventListener('click', () => {
      stopAutoplay();
      goTo(REAL_START + i, false);
    });
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  dotsWrap.addEventListener('keydown', (e) => {
    const currentIndex = dots.indexOf(document.activeElement);
    if (currentIndex === -1) return;
    let targetIndex = -1;
    if (e.key === 'ArrowRight') {
      targetIndex = (currentIndex + 1) % dots.length;
    } else if (e.key === 'ArrowLeft') {
      targetIndex = (currentIndex - 1 + dots.length) % dots.length;
    } else if (e.key === 'Home') {
      targetIndex = 0;
    } else if (e.key === 'End') {
      targetIndex = dots.length - 1;
    }
    if (targetIndex !== -1) {
      e.preventDefault();
      stopAutoplay();
      goTo(REAL_START + targetIndex, false);
      dots[targetIndex].focus();
    }
  });

  function normalize(raw) {
    return ((raw - REAL_START) % TOTAL + TOTAL) % TOTAL + REAL_START;
  }

  function applyLayers() {
    allSlides.forEach((slide, i) => {
      const offset = i - index;
      slide.classList.remove('is-current', 'is-prev', 'is-next');
      if (offset === 0) {
        slide.classList.add('is-current');
      } else if (offset === -1) {
        slide.classList.add('is-prev');
      } else if (offset === 1 || offset === 2) {
        slide.classList.add('is-next');
      }
    });
  }

  function render(animated) {
    track.style.transition = animated ? '' : 'none';
    track.style.transform = `translateX(${-index * STEP}%)`;
    if (!animated) {
      void track.offsetWidth;
      track.style.transition = '';
    }
    const photo = normalize(index) - REAL_START;
    dots.forEach((dot, i) => {
      const isActive = i === photo;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
      dot.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    applyLayers();
  }

  function snapToReal() {
    const target = normalize(index);
    if (target !== index) {
      index = target;
      root.classList.add('is-snapping');
      requestAnimationFrame(() => {
        render(false);
        requestAnimationFrame(() => root.classList.remove('is-snapping'));
      });
    }
  }

  function goTo(nextIndex, animated = true) {
    index = Math.max(0, Math.min(ANIM_MAX, nextIndex));
    render(animated);
  }

  function next() {
    stopAutoplay();
    goTo(index + 1);
  }

  function prev() {
    stopAutoplay();
    goTo(index - 1);
  }

  function startAutoplay() {
    if (reducedMotion.matches || !inView) return;
    stopAutoplay();
    autoplayId = setInterval(() => {
      goTo(index + 1);
    }, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  track.addEventListener('transitionend', (e) => {
    if (e.target === track) {
      snapToReal();
    }
  });

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', startAutoplay);

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(REAL_START, false);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(REAL_START + TOTAL - 1, false);
    }
  });

  let touchStartX = 0;
  root.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  root.addEventListener('touchend', (e) => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) >= 40) {
      if (dx > 0) {
        next();
      } else {
        prev();
      }
    }
    startAutoplay();
  }, { passive: true });

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      inView = entry.isIntersecting;
      if (inView) {
        startAutoplay();
      } else {
        stopAutoplay();
      }
    });
  }, { threshold: 0.3 }).observe(root);

  render(false);
}

initCarousel(document.getElementById('oficinaCarousel'), 3);
initCarousel(document.getElementById('sorteioCarousel'), 1);
