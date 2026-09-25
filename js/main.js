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
const themeButton = document.getElementById('theme-toggle');

themeButton.addEventListener('click', function () {
  const root = document.documentElement;
  const newTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = newTheme;
  themeButton.setAttribute('aria-label', newTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  try { localStorage.setItem('theme', newTheme); } catch (e) { /* private mode: ignore */ }
});
themeButton.setAttribute('aria-label',
  document.documentElement.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');


// ---------- 2. Mobile menu ----------
const menuButton = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (menuButton && navLinks) {
  menuButton.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
  // Close the menu after tapping a link
  navLinks.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
      navLinks.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
}


// ---------- 3. Footer year ----------
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();
