/* =====================================================================
   main.js — the only JavaScript on the site. Each numbered part is
   independent; if one part fails, the rest (and all the content) still work.

   1. Light/dark theme toggle (remembers the visitor's choice)
   2. Mobile menu open/close
   3. Footer year
   4. Scroll reveal (items fade in as you scroll)
   5. Smart navigation (active menu link, progress bar, back-to-top)
   6. Thesis numbers count up
   7. Rotating keywords in the headline
   8. Project filters
   9. Photo lightbox (click a photo to enlarge it)
   10. Copy-email button

   Animations are skipped for visitors whose device asks for reduced motion.
   ===================================================================== */

const root = document.documentElement;
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const srStatus = document.getElementById('sr-status'); // invisible text read aloud by screen readers

function announce(message) {
  if (!srStatus) return;
  srStatus.textContent = '';
  setTimeout(function () { srStatus.textContent = message; }, 50);
}


// ---------- 1. Theme toggle ----------
// (The starting theme is already set by the tiny script in <head>, so the
//  page never "flashes" the wrong colors while loading.)
const themeButton = document.getElementById('theme-toggle');

function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

themeButton.addEventListener('click', function () {
  const newTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  try { localStorage.setItem('theme', newTheme); } catch (e) { /* private mode: ignore */ }
});
setTheme(root.dataset.theme);

// If the visitor never pressed the toggle, follow their device when it
// switches between light and dark (e.g. automatic dark mode at night).
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    if (!saved) setTheme(event.matches ? 'dark' : 'light');
  });
}


// ---------- 2. Mobile menu ----------
const menuButton = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (menuButton && navLinks) {
  const setMenu = function (open) {
    navLinks.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  menuButton.addEventListener('click', function () {
    setMenu(!navLinks.classList.contains('open'));
  });
  // Close the menu after tapping a link
  navLinks.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') setMenu(false);
  });
  // Close the menu when tapping anywhere outside it
  document.addEventListener('click', function (event) {
    if (navLinks.classList.contains('open') && !navLinks.contains(event.target) && !menuButton.contains(event.target)) {
      setMenu(false);
    }
  });
  // Close the menu with the Esc key, and put keyboard focus back on the button
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && navLinks.classList.contains('open')) {
      setMenu(false);
      menuButton.focus();
    }
  });
}


// ---------- 3. Footer year ----------
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();


// ---------- 4. Scroll reveal ----------
// Picks these items automatically (new projects/jobs you add get it too).
const revealSelector = [
  '.section-label', '.section > .container > h2', '.section-intro', '.filters',
  '.about-grid > *', '.thesis-top > *', '.case-block', '.card',
  '.timeline > li', '.skill-group', '.edu-list > li', '.contact-box'
].join(', ');
const revealItems = document.querySelectorAll(revealSelector);

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  revealItems.forEach(function (item) {
    // Items side by side (cards, skill boxes) appear one after another
    const position = Array.prototype.indexOf.call(item.parentElement.children, item);
    item.style.setProperty('--reveal-delay', (position % 3) * 90 + 'ms');
    item.classList.add('reveal');
    revealObserver.observe(item);
  });
}


// ---------- 5. Smart navigation ----------
// 5a. Highlight the menu link of the section that's on screen
const menuLinks = document.querySelectorAll('#nav-links a[href^="#"]');
if ('IntersectionObserver' in window && menuLinks.length) {
  const linkFor = {};
  menuLinks.forEach(function (link) { linkFor[link.getAttribute('href').slice(1)] = link; });

  const clearActive = function () {
    menuLinks.forEach(function (link) { link.classList.remove('active'); link.removeAttribute('aria-current'); });
  };
  const spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      clearActive();
      const link = linkFor[entry.target.id];
      if (link) { link.classList.add('active'); link.setAttribute('aria-current', 'true'); }
    });
  }, { rootMargin: '-45% 0px -50% 0px' }); // "on screen" = crossing the middle of the window

  Object.keys(linkFor).concat('top').forEach(function (id) {
    const section = document.getElementById(id);
    if (section) spy.observe(section);
  });
}

// 5b. Progress bar + 5c. back-to-top button (updated at most once per frame)
const progressBar = document.getElementById('scroll-progress-bar');
const toTopButton = document.querySelector('.to-top');
let scrollQueued = false;

function onScroll() {
  const scrolled = root.scrollTop || document.body.scrollTop;
  const scrollable = root.scrollHeight - root.clientHeight;
  if (progressBar) progressBar.style.transform = 'scaleX(' + (scrollable > 0 ? scrolled / scrollable : 0) + ')';
  if (toTopButton) toTopButton.classList.toggle('show', scrolled > 600);
  scrollQueued = false;
}
window.addEventListener('scroll', function () {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); }
}, { passive: true });
onScroll();


// ---------- 6. Thesis numbers count up ----------
// Uses data-count / data-decimals / data-prefix / data-suffix on the <b> tags.
const counters = document.querySelectorAll('[data-count]');

function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // fast start, gentle stop
    el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if ('IntersectionObserver' in window && !reduceMotion && counters.length) {
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { countUp(entry.target); counterObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  counters.forEach(function (el) { counterObserver.observe(el); });
}


// ---------- 7. Rotating keywords ----------
// The words come from data-words="A|B|C" on the <span class="rotator">.
const rotator = document.querySelector('.rotator');

if (rotator && rotator.dataset.words && !reduceMotion) {
  const words = rotator.dataset.words.split('|');
  // Screen readers get the first phrase once, instead of hearing the typing
  const staticCopy = document.createElement('span');
  staticCopy.className = 'sr-only';
  staticCopy.textContent = words[0];
  rotator.after(staticCopy);
  rotator.setAttribute('aria-hidden', 'true');
  rotator.classList.add('typing');

  let wordIndex = 0;                 // which phrase is showing
  let letters = words[0].length;     // how many of its letters are visible
  let deleting = true;               // erasing (true) or typing (false)

  const tick = function () {
    let wait;
    if (deleting) {
      letters--;
      wait = 35;                     // erase speed (ms per letter)
      if (letters <= 0) {            // fully erased: move on to the next phrase
        letters = 0;
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        wait = 350;
      }
    } else {
      letters++;
      wait = 75;                     // typing speed (ms per letter)
      if (letters >= words[wordIndex].length) {
        deleting = true;
        wait = 2400;                 // how long each full phrase stays on screen
      }
    }
    rotator.textContent = words[wordIndex].slice(0, letters);
    setTimeout(tick, wait);
  };
  setTimeout(tick, 2400);            // show the first phrase for a moment before starting
}


// ---------- 8. Project filters ----------
const filterBar = document.getElementById('project-filters');
const projectCards = document.querySelectorAll('.projects-grid .card');

if (filterBar && projectCards.length) {
  const buttons = filterBar.querySelectorAll('.filter-btn');

  // Show how many projects each button would show, e.g. "Embedded & IoT 4"
  buttons.forEach(function (button) {
    const filter = button.dataset.filter;
    const count = Array.prototype.filter.call(projectCards, function (card) {
      return filter === 'all' || (card.dataset.category || '').split(' ').indexOf(filter) !== -1;
    }).length;
    const badge = document.createElement('span');
    badge.className = 'count';
    badge.textContent = count;
    button.append(' ', badge); // the space makes screen readers say "All 5", not "All5"
  });

  filterBar.addEventListener('click', function (event) {
    const button = event.target.closest('.filter-btn');
    if (!button) return;
    const filter = button.dataset.filter;
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); });

    let shown = 0;
    projectCards.forEach(function (card) {
      const match = filter === 'all' || (card.dataset.category || '').split(' ').indexOf(filter) !== -1;
      if (match) {
        if (card.hidden) {
          card.hidden = false;
          // replay the fade-in for cards that come back
          card.classList.remove('is-visible'); void card.offsetWidth; card.classList.add('is-visible');
        }
        shown++;
      } else {
        card.hidden = true;
      }
    });
    announce('Showing ' + shown + (shown === 1 ? ' project' : ' projects'));
  });

  filterBar.hidden = false; // the buttons only appear when this code is running
}


// ---------- 9. Photo lightbox ----------
if (typeof HTMLDialogElement === 'function') {
  const lightbox = document.createElement('dialog');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-label', 'Enlarged photo');
  lightbox.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close photo">&times;</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(lightbox);

  const bigImage = lightbox.querySelector('img');
  const caption = lightbox.querySelector('figcaption');
  let openedFrom = null;

  const openPhoto = function (img) {
    bigImage.src = img.currentSrc || img.src;
    bigImage.alt = img.alt;
    const figure = img.closest('figure');
    const figcaption = figure && figure.querySelector('figcaption');
    caption.textContent = figcaption ? figcaption.textContent : img.alt;
    openedFrom = img;
    lightbox.showModal();
  };

  lightbox.querySelector('.lightbox-close').addEventListener('click', function () { lightbox.close(); });
  lightbox.addEventListener('click', function (event) { if (event.target === lightbox) lightbox.close(); }); // tap outside
  lightbox.addEventListener('close', function () { if (openedFrom) openedFrom.focus(); });

  // Every project photo and the thesis image can be enlarged (mouse, touch or keyboard)
  document.querySelectorAll('.card img, .thesis-top img').forEach(function (img) {
    img.classList.add('zoomable');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Enlarge photo: ' + img.alt);
    img.addEventListener('click', function () { openPhoto(img); });
    img.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPhoto(img); }
    });
  });
}


// ---------- 10. Copy-email button ----------
const copyButton = document.querySelector('.copy-btn');

if (copyButton && navigator.clipboard && window.isSecureContext) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', function () {
    navigator.clipboard.writeText(copyButton.dataset.copy).then(function () {
      copyButton.textContent = 'Copied ✓';
      copyButton.classList.add('copied');
      announce('Email address copied');
      setTimeout(function () { copyButton.textContent = 'Copy'; copyButton.classList.remove('copied'); }, 2000);
    });
  });
}
