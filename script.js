const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const navLinks = [...nav.querySelectorAll('a')];
const mobileViewport = window.matchMedia('(max-width: 800px)');

// JavaScript yoksa bağlantılar görünür kalır.
nav.classList.add('enhanced');
menuToggle.hidden = false;

function setMenuOpen(isOpen) {
  nav.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

// Kaydırma ve adres çubuğu tarayıcının doğal bağlantı davranışını kullanır.
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    setMenuOpen(false);
    const target = document.querySelector(link.hash);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

document.addEventListener('click', (event) => {
  if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
    setMenuOpen(false);
  }
});

mobileViewport.addEventListener('change', () => {
  if (mobileViewport.matches && nav.contains(document.activeElement)) {
    menuToggle.focus();
  }
  setMenuOpen(false);
});

// Sayfadaki sıraya göre son geçilen ana bölüm menüde işaretlenir.
const sections = navLinks
  .map((link) => ({ link, target: document.querySelector(link.hash) }))
  .sort((first, second) => first.target.offsetTop - second.target.offsetTop);
let scrollPending = false;

function updateCurrentSection() {
  let current = sections[0];
  const threshold = window.innerHeight * 0.3;
  for (const section of sections) {
    if (section.target.getBoundingClientRect().top <= threshold) {
      current = section;
    }
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    current = sections[sections.length - 1];
  }
  for (const section of sections) {
    if (section === current) {
      section.link.setAttribute('aria-current', 'location');
    } else {
      section.link.removeAttribute('aria-current');
    }
  }
  scrollPending = false;
}

window.addEventListener('scroll', () => {
  if (!scrollPending) {
    scrollPending = true;
    window.requestAnimationFrame(updateCurrentSection);
  }
}, { passive: true });
window.addEventListener('resize', updateCurrentSection);
window.addEventListener('load', updateCurrentSection);
updateCurrentSection();
document.querySelector('#year').textContent = new Date().getFullYear();
