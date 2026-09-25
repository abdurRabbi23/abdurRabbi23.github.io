/* =====================================================================
   main.js — the only JavaScript on the site. It does three small things:
   1. Light/dark theme toggle (remembers the visitor's choice)
   2. Mobile menu open/close
   3. Puts the current year in the footer
   The site still works (in the device's own theme) if this file fails.
   ===================================================================== */

// ---------- 1. Theme toggle ----------
// (The starting theme is already set by the tiny script in <head>, so the
//  page never "flashes" the wrong colors while loading.)
const root = document.documentElement;
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
