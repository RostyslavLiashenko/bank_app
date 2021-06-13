'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const links = document.querySelectorAll('.nav__link');
const nav = document.querySelector('.nav');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const header = document.querySelector('.header');
const slides = document.querySelectorAll('.slide');

// Modal window
const openModal = function(e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function(e) {
  const s1coords = section1.getBoundingClientRect();
  window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);
  window.scrollTo({
    top: s1coords.top + window.pageYOffset,
    left: s1coords.left + window.pageXOffset,
    behavior: 'smooth'
  });

  section1.scrollIntoView({ behavior: 'smooth' });
});

// Event delegation
// 1. Add  eventListener to parent elem
// 2. Determine what elem originated the event
document.querySelector('.nav__links').addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.matches('.nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component
tabsContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(el => el.classList.remove('operations__content--active'));
  clicked.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);

// Revealing sections
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: .15
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy Loading images
const loading = function(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgTargets = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});
imgTargets.forEach(img => imgObserver.observe(img));

//Slider
const slider = function() {
  const dotContainer = document.querySelector('.dots');
  const createDots = function() {
    slides.forEach(function(_, i) {
      dotContainer.insertAdjacentHTML(`beforeend`, `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  };

//Functions
  const activateDot = function(slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };
  const goToSlide = function(slide) {
    slides.forEach((el, i) => el.style.transform = `translateX(${(i - slide) * 100}%)`);
  };

//Initialization
  const init = function() {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();
// Going to the next slide
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  let currentSlide = 0;
  const maxSlides = slides.length;

// Next slide
  const nextSlide = function() {
    if (currentSlide === maxSlides - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  btnRight.addEventListener('click', nextSlide);

  const prevSlide = function() {
    if (currentSlide === 0) {
      currentSlide = maxSlides - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  btnLeft.addEventListener('click', prevSlide);

// Going slides by using keyboard
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = 'We use your cookie to improve functionality and analytics. <button class = "btn btn--close-cookie">Got it!</button>';
header.append(message);

document.querySelector('.btn--close-cookie').addEventListener('click', function(e) {
  e.preventDefault();
  message.parentElement.removeChild(message);
});

message.style.backgroundColor = '#37383d';
message.style.width = '120%';

message.style.height = Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
