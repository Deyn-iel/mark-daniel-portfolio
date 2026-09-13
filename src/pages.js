import './theme.css';
import './chat.js';
import poultryImage from '../img/poultry.jfif?url';
import poultry2Image from '../img/poultry2.jpg';
import poultry3Image from '../img/poultry3.jfif?url';
import poultry4Image from '../img/poultry4.jfif?url';
import trashImage from '../img/autotrashcan.jfif?url';
import stapleImage from '../img/staple.jfif?url';
import pinnacleImage from '../img/pinnacle.png';
import careersImage from '../img/careers.png';
import aisuImage from '../img/aisu.png';

// Let Vite bundle the resume so the download also works after deployment.
document.querySelector('a[download]').href = new URL('../img/Mark-Daniel-Alindayu_CV_resume-fix.docx', import.meta.url).href;

const pages = ['home', 'services', 'works', 'skills', 'feedback', 'education', 'contact'];
const label = id => id[0].toUpperCase() + id.slice(1);
const main = document.createElement('main');
main.id = 'main-content';
document.querySelector('#home').before(main);
document.querySelectorAll('body > section').forEach(section => main.append(section));
const pager = document.createElement('nav');
pager.className = 'page-navigation container';
pager.setAttribute('aria-label', 'Portfolio pages');
main.after(pager);
document.querySelectorAll('.nav-links a[href="#about"], .drawer-links a[href="#about"]').forEach(link => link.remove());
const header = document.querySelector('.nav');
const navLinks = document.querySelector('.nav-links');
navLinks.setAttribute('aria-label', 'Main navigation');
const indicator = document.createElement('span');
indicator.className = 'nav-indicator';
indicator.setAttribute('aria-hidden', 'true');
navLinks.prepend(indicator);
header.querySelector('.brand').outerHTML = '<span class="nav-mobile-title">Explore <span>Home</span></span>';
header.querySelector('.nav-actions .pill').remove();
document.querySelector('.drawer-head .brand').outerHTML = '<span class="drawer-title">Explore<span class="vio">.</span></span>';
function updateIndicator() {
  const active = navLinks.querySelector('[aria-current]');
  if (!active) return;
  indicator.style.width = `${active.offsetWidth}px`;
  indicator.style.transform = `translateX(${active.offsetLeft}px)`;
}
new ResizeObserver(updateIndicator).observe(navLinks);
document.fonts.ready.then(updateIndicator);
window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 24), { passive: true });
document.querySelectorAll('a[target="_blank"]').forEach(link => { link.rel = 'noopener noreferrer'; });
document.querySelectorAll('.iconbtn').forEach(link => link.setAttribute('aria-label', link.title));
document.querySelectorAll('.section-head').forEach((head, index) => {
  const eyebrow = document.createElement('span');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = `${String(index + 1).padStart(2, '0')} / ${index === 0 ? 'THE PERSON BEHIND THE CODE' : 'EXPLORE MY PORTFOLIO'}`;
  head.prepend(eyebrow);
});
document.querySelector('.portrait').insertAdjacentHTML('beforeend', '<div class="portrait-caption"><span>WEB + IoT DEVELOPMENT</span><span aria-hidden="true">↗</span></div>');
document.querySelector('.hero-card').insertAdjacentHTML('beforeend', '<a class="about-link" href="#about">A little about me <span aria-hidden="true">↓</span></a>');
const projectImages = {
  poultry: [poultryImage, 'Poultry monitoring prototype with sensors, a cooling fan, and a laptop'],
  autotrashcan: [trashImage, 'Automated trash can prototype with separate biodegradable and non-biodegradable bins'],
  staple: [stapleImage, 'STAPLE safety alert prototype with its wired sensor circuit inside an enclosure'],
  pinnacle: [pinnacleImage, 'Pinnacle Global Franchising website homepage'],
  careers: [careersImage, 'Pinnacle Global careers portal homepage'],
  aisu: [aisuImage, 'Chat AISU concept interface with campus information prompts'],
};
document.querySelectorAll('.work').forEach(work => {
  const asset = projectImages[work.dataset.project];
  if (!asset) return;
  const preview = document.createElement('button');
  preview.type = 'button';
  preview.setAttribute('aria-label', `View full photo: ${asset[1]}`);
  preview.className = 'project-preview';
  const img = document.createElement('img');
  [img.src, img.alt] = asset;
  img.loading = 'lazy';
  img.decoding = 'async';
  preview.append(img);
  preview.addEventListener('click', () => openPhoto(asset, work.dataset.project));
  work.prepend(preview);
});

const photoDialog = document.createElement('dialog');
photoDialog.className = 'photo-dialog';
photoDialog.setAttribute('aria-label', 'Project photo');
photoDialog.innerHTML = '<img alt="" /><button type="button" aria-label="Close photo">×</button>';
document.body.append(photoDialog);
photoDialog.insertAdjacentHTML('beforeend', '<button class="photo-prev" type="button" aria-label="Previous photo" hidden>‹</button><button class="photo-next" type="button" aria-label="Next photo" hidden>›</button>');
let photoGallery = [];
let photoIndex = 0;
function showPhoto(index) {
  photoIndex = (index + photoGallery.length) % photoGallery.length;
  const img = photoDialog.querySelector('img');
  [img.src, img.alt] = photoGallery[photoIndex];
  photoDialog.setAttribute('aria-label', `Project photo ${photoIndex + 1} of ${photoGallery.length}`);
}
function changePhoto(step) {
  if (!photoClosing && photoGallery.length > 1) showPhoto(photoIndex + step);
}
photoDialog.querySelector('.photo-prev').addEventListener('click', () => changePhoto(-1));
photoDialog.querySelector('.photo-next').addEventListener('click', () => changePhoto(1));
photoDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    changePhoto(event.key === 'ArrowLeft' ? -1 : 1);
  }
});
let photoClosing = false;
let previousOverflow = '';
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function openPhoto(asset, project) {
  photoGallery = project === 'poultry' ? [asset,
    [poultry2Image, 'Poultry monitoring system — photo 2'],
    [poultry3Image, 'Poultry monitoring system — photo 3'],
    [poultry4Image, 'Poultry monitoring system — photo 4'],
  ] : [asset];
  photoDialog.querySelectorAll('.photo-prev, .photo-next').forEach(button => { button.hidden = photoGallery.length < 2; });
  showPhoto(0);
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  photoDialog.showModal();
  if (!reducedMotion()) photoDialog.animate([
    { opacity: 0, transform: 'scale(.96) translateY(12px)' },
    { opacity: 1, transform: 'scale(1) translateY(0)' },
  ], { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' });
}
async function closePhoto() {
  if (photoClosing || !photoDialog.open) return;
  photoClosing = true;
  if (!reducedMotion()) await photoDialog.animate([
    { opacity: 1, transform: 'scale(1)' },
    { opacity: 0, transform: 'scale(.97)' },
  ], { duration: 180, easing: 'ease-in' }).finished;
  photoDialog.close();
  document.body.style.overflow = previousOverflow;
  photoClosing = false;
}
photoDialog.querySelector('button').addEventListener('click', closePhoto);
photoDialog.addEventListener('click', event => { if (event.target === photoDialog) closePhoto(); });
photoDialog.addEventListener('cancel', event => { event.preventDefault(); closePhoto(); });

const drawer = document.getElementById('drawer');
const openButton = document.getElementById('openDrawer');
const closeButton = document.getElementById('closeDrawer');
openButton.setAttribute('aria-controls', 'drawer');
function setDrawer(open, restoreFocus = true) {
  drawer.classList.toggle('open', open);
  drawer.inert = !open;
  drawer.setAttribute('aria-hidden', String(!open));
  openButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  [main, document.querySelector('.nav'), pager, document.querySelector('footer')].forEach(el => { el.inert = open; });
  if (open) closeButton.focus();
  else if (restoreFocus) openButton.focus();
}
setDrawer(false, false);
openButton.addEventListener('click', () => setDrawer(true));
closeButton.addEventListener('click', () => setDrawer(false));
document.getElementById('drawerBackdrop').addEventListener('click', () => setDrawer(false));
drawer.addEventListener('click', event => { if (event.target.closest('a')) setDrawer(false, false); });
document.addEventListener('keydown', event => {
  if (!drawer.classList.contains('open')) return;
  if (event.key === 'Escape') setDrawer(false);
  if (event.key === 'Tab') {
    const focusable = [...drawer.querySelectorAll('a, button')];
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
function renderPage(initial = false) {
  const hash = location.hash.slice(1) || 'home';
  const page = pages.includes(hash) ? hash : 'home';
  const index = pages.indexOf(page);
  const changedPage = document.body.dataset.page !== page;
  main.querySelectorAll(':scope > section').forEach(section => { section.hidden = section.id !== page && !(page === 'home' && section.id === 'about'); });
  document.body.dataset.page = page;
  header.querySelector('.nav-mobile-title span').textContent = label(page);
  document.title = `${label(page)} — Mark Daniel Alindayu`;
  document.querySelectorAll('.nav-links a, .drawer-links a').forEach(link => {
    if (link.hash === `#${page}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  updateIndicator();
  if (!initial && changedPage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    main.getAnimations().forEach(animation => animation.cancel());
    main.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 360, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }
  const previous = pages[index - 1], next = pages[index + 1];
  pager.innerHTML = `${previous ? `<a class="page-step" href="#${previous}"><span aria-hidden="true">↖</span><span><small>PREVIOUS PAGE</small>${label(previous)}</span></a>` : '<span class="pager-intro">A little more to discover.</span>'}<span class="page-count">0${index + 1} <span>/ 0${pages.length}</span></span>${next ? `<a class="page-step next" href="#${next}"><span><small>UP NEXT</small>${label(next)}</span><span aria-hidden="true">↗</span></a>` : '<a class="page-step next" href="#home">Back to home <span aria-hidden="true">↗</span></a>'}`;
  const target = hash === 'about' ? document.getElementById('about') : main.querySelector('section:not([hidden]) h1, section:not([hidden]) h2');
  if (!initial) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  const behavior = initial || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
  if (hash === 'about') target.scrollIntoView({ behavior, block: 'start' });
  else window.scrollTo({ top: 0, behavior: changedPage ? 'instant' : behavior });
}
window.addEventListener('hashchange', () => renderPage());
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href^="#"]');
  if (link?.getAttribute('href') === '#main-content') {
    event.preventDefault(); main.tabIndex = -1; main.focus(); return;
  }
  if (link && (pages.includes(link.hash.slice(1)) || link.hash === '#about')) {
    event.preventDefault();
    if (link.hash !== location.hash) history.pushState(null, '', link.hash);
    renderPage();
  }
});
renderPage(true);

const accordionItems = [...document.querySelectorAll('.acc-item')];
function updateAccordion(item, open, animate = true) {
  const panel = item.querySelector('.acc-panel');
  const height = panel.getBoundingClientRect().height;
  panel.getAnimations().forEach(animation => animation.cancel());
  item.classList.toggle('open', open);
  item.querySelector('.acc-btn').setAttribute('aria-expanded', String(open));
  panel.inert = !open;
  panel.hidden = false;
  const targetHeight = open ? panel.scrollHeight : 0;
  if (!animate || reducedMotion() || height === targetHeight) {
    panel.hidden = !open;
    panel.style.overflow = '';
    return;
  }
  panel.style.overflow = 'hidden';
  const animation = panel.animate([{ height: `${height}px`, opacity: open ? 0.4 : 1 }, { height: `${targetHeight}px`, opacity: open ? 1 : 0 }], {
    duration: 320, easing: 'cubic-bezier(.22,1,.36,1)',
  });
  animation.onfinish = () => { panel.hidden = !open; panel.style.overflow = ''; };
}
accordionItems.forEach((item, index) => {
  const button = item.querySelector('.acc-btn');
  const panel = item.querySelector('.acc-panel');
  panel.id = `service-panel-${index}`;
  button.setAttribute('aria-controls', panel.id);
  updateAccordion(item, index === 0, false);
  button.addEventListener('click', () => {
    const open = !item.classList.contains('open');
    accordionItems.forEach(other => updateAccordion(other, other === item && open));
  });
});
const tabs = document.getElementById('tabs');
tabs.setAttribute('aria-label', 'Filter projects');
tabs.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
tabs.addEventListener('click', event => {
  const button = event.target.closest('.tab');
  if (!button) return;
  tabs.querySelectorAll('button').forEach(tab => {
    tab.classList.toggle('active', tab === button);
    tab.setAttribute('aria-pressed', String(tab === button));
  });
  document.querySelectorAll('.work').forEach(work => { work.hidden = button.dataset.filter !== 'all' && work.dataset.cat !== button.dataset.filter; });
});
const contactLinks = { Email: 'mailto:atchoyalindayu@gmail.com', Phone: 'tel:+639937259373', GitHub: 'https://github.com/Deyn-iel', LinkedIn: 'https://linkedin.com/in/markdanielalindayu', Portfolio: 'https://mark-daniel-portfolio.vercel.app' };
document.querySelectorAll('.citem').forEach(item => {
  const href = contactLinks[item.querySelector('small')?.textContent];
  if (!href) return;
  const link = document.createElement('a');
  link.className = item.className; link.href = href; link.innerHTML = item.innerHTML;
  item.replaceWith(link);
});
