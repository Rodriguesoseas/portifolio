const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-link');

function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}

function toggleMenu() {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
}

function closeMenu() {
  navToggle.classList.remove('active');
  navLinks.classList.remove('open');
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

const sections = document.querySelectorAll('.section, .hero');

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

sections.forEach(section => {
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
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillItems.forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(20px)';
  item.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  skillObserver.observe(item);
});

function updateActiveSection() {
  const scrollPos = window.scrollY + 120;
  const sections = document.querySelectorAll('section[id]');

  sections.forEach(section => {
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

function updateParallax() {
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
