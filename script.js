/* script.js
   Controls:
   - AOS init
   - Smooth scroll highlight for navbar
   - Scroll-to-top button
   - Simple contact form handler (client-side)
   - Theme toggle (dark/light)
*/

// Initialize AOS animations
AOS.init({
  once: true,
  duration: 800,
  easing: 'ease-out-cubic'
});

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth active nav link highlighting
const navLinks = document.querySelectorAll('.nav-link');
const sections = Array.from(navLinks).map(link => {
  const id = link.getAttribute('href');
  return document.querySelector(id);
});

// Intersection Observer to toggle active link
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.55 };
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = '#' + entry.target.id;
    const activeLink = document.querySelector(`.nav-link[href="${id}"]`);
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, observerOptions);

sections.forEach(sec => { if (sec) observer.observe(sec); });

// Smooth scroll for anchor links (extra to default behavior)
document.querySelectorAll('a.nav-link[href^="#"], a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    // ignore links that just point to '#'
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close bootstrap collapse on small devices
      const bsCollapse = document.querySelector('.navbar-collapse');
      if (bsCollapse && bsCollapse.classList.contains('show')) {
        const collapseInstance = bootstrap.Collapse.getInstance(bsCollapse);
        if (collapseInstance) collapseInstance.hide();
      }
    }
  });
});

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Contact form simple handler (client-side only)
const contactForm = document.getElementById('contactForm');
const formAlert = document.getElementById('formAlert');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showFormAlert('Please fill in all fields.', 'danger');
    return;
  }

  // Example behavior: open mail client when submit (simple fallback)
  const mailto = `mailto:jatin@example.com?subject=${encodeURIComponent('Portfolio inquiry from ' + name)}&body=${encodeURIComponent(message + '\n\nContact: ' + email)}`;
  window.location.href = mailto;

  showFormAlert('Your email client was opened. You can also contact directly at jatin@example.com', 'success');
  contactForm.reset();
});

function showFormAlert(msg, type = 'info'){
  formAlert.className = `mt-3 alert alert-${type}`;
  formAlert.textContent = msg;
  formAlert.classList.remove('visually-hidden');
  setTimeout(() => { formAlert.classList.add('visually-hidden'); }, 6000);
}

// Theme toggle (dark/light)
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
let darkMode = localStorage.getItem('darkMode') ?? (prefersDark ? 'true' : 'true');

applyTheme(darkMode === 'true');

themeToggle.addEventListener('click', () => {
  darkMode = (localStorage.getItem('darkMode') === 'true') ? 'false' : 'true';
  localStorage.setItem('darkMode', darkMode);
  applyTheme(darkMode === 'true');
});

function applyTheme(isDark){
  if (isDark){
    document.documentElement.style.setProperty('--bg', '#071229');
    document.documentElement.style.setProperty('--card', '#0e1a2b');
    themeToggle.innerHTML = '<i class="fa-regular fa-moon"></i>';
  } else {
    // light theme overrides (simple)
    document.documentElement.style.setProperty('--bg', '#f6fbff');
    document.documentElement.style.setProperty('--card', '#ffffff');
    themeToggle.innerHTML = '<i class="fa-regular fa-sun"></i>';
  }
}
