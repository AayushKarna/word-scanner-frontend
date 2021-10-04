const overlay = document.getElementById('loader-overlay');
const preLoader = document.getElementById('preloader');
const loader = document.getElementById('loader');
const allLinks = document.querySelectorAll('a:link');
const scanBtn = document.getElementById('scan-btn');

const showLoader = function () {
  loader.classList.remove('hidden-el');
  preLoader.classList.remove('hidden-el');
  overlay.classList.remove('hidden-el');
};

const hideLoader = function () {
  loader.classList.add('hidden-el');
  preLoader.classList.add('hidden-el');
  overlay.classList.add('hidden-el');
};

const smoothScroll = function (href) {
  // scroll back to top
  if (href === '#') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  if (href !== '#' && href !== '#!' && href.startsWith('#')) {
    const sectionEl = document.querySelector(href);
    sectionEl.scrollIntoView({
      behavior: 'smooth',
    });
  }
};

scanBtn.addEventListener('click', e => {
  const href = e.target.dataset.href;
  smoothScroll(href);
});

window.addEventListener('load', () => {
  hideLoader();
});
