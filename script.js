/* =========================================================
   RENO SPA  –  script.js
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   1. SETTINGS  (you can edit these)
   --------------------------------------------------------- */
const CONFIG = {
  hotelName: 'Reno Spa',
  adminPassword: 'royale2026',        // Staff password (demo only – visible in code)
  vatRate: 0.20,                      // UK VAT 20% (prices include VAT)
  googleSheetsWebhook: '',            // OPTIONAL: paste your Google Apps Script URL here
  storageKey: 'kr_orders_v1',
  enquiryKey: 'kr_enquiries_v1',
  newsletterKey: 'kr_newsletter_v1'
};

/* ---------------------------------------------------------
   2. DATA  –  change prices, text and images here
   --------------------------------------------------------- */
const img = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const ROOMS = [
  {
    id: 'deluxe', name: 'Royal Deluxe Room', tag: 'Best Value', price: 295, capacity: 2,
    bed: 'King bed', size: '32 m²', inventory: 10,
    image: img('1631049307264-da0ec9d70304'),
    short: 'An elegant retreat with a plush king bed, marble bathroom and calming courtyard views, the perfect base for a world escape.',
    features: ['Courtyard or park view', 'Marble bathroom, rainfall shower', 'Nespresso machine & tea tray', '55" smart TV', 'Egyptian cotton bed linen', 'Complimentary Wi-Fi', 'Evening turn-down service', 'Air conditioning']
  },
  {
    id: 'executive', name: 'Reno Spa Executive Suite', tag: 'Most Popular', price: 425, capacity: 3,
    bed: 'King bed + sofa bed', size: '52 m²', inventory: 6,
    image: img('1578683010236-d716f9a3f461'),
    short: 'A spacious suite with a separate lounge and work area, plus access to the Executive Lounge for breakfast and evening canapés.',
    features: ['Separate living room', 'Executive Lounge access', 'Large work desk', 'Double-sink marble bathroom', 'Walk-in wardrobe', 'Bose sound system', 'Pressing service on arrival', 'Complimentary Wi-Fi']
  },
  {
    id: 'grand', name: 'Grand Royal Suite', tag: 'Signature', price: 640, capacity: 4,
    bed: 'Super King + sofa bed', size: '78 m²', inventory: 3,
    image: img('1582719478250-c89cae4dc85b'),
    short: 'Our signature suite: sweeping Hyde Park views, a freestanding bath, a dining area for four and personal butler service.',
    features: ['Hyde Park views', 'Freestanding soaking bath', 'Dining table for four', 'Personal butler service', 'Dressing room', 'Two 65" smart TVs', 'Evening champagne service', 'Complimentary minibar']
  },
  {
    id: 'presidential', name: 'Presidential Suite', tag: 'Ultimate Luxury', price: 1250, capacity: 6,
    bed: '2 Super King bedrooms', size: '145 m²', inventory: 1,
    image: img('1618773928121-c32242e63f39'),
    short: 'The pinnacle of Reno Spa: two bedrooms, a private terrace, a baby grand piano and a private dining room, with a dedicated butler.',
    features: ['Private rooftop terrace', 'Baby grand piano', 'Private dining room for eight', 'Dedicated butler 24/7', 'Two marble bathrooms + steam room', 'Chauffeur airport transfer', 'Private spa suite access', 'Champagne on arrival']
  }
];

const EXTRAS = [
  { id: 'breakfast', name: 'Full English Breakfast', price: 32, unit: 'per guest / night', mode: 'guestNight' },
  { id: 'tea',       name: 'Afternoon Tea',          price: 55, unit: 'per guest',          mode: 'guest' },
  { id: 'spa',       name: 'Spa Access Pass',        price: 75, unit: 'per guest',          mode: 'guest' },
  { id: 'transfer',  name: 'Airport Transfer (Heathrow)', price: 95, unit: 'per journey',   mode: 'flat' },
  { id: 'parking',   name: 'Valet Parking',          price: 45, unit: 'per night',          mode: 'night' },
  { id: 'champagne', name: 'Champagne on Arrival',   price: 85, unit: 'per bottle',         mode: 'flat' }
];

const OFFERS = [
  {
    id: 'weekend', name: 'Weekend Escape', kind: 'package', nights: 2, price: 549, was: 640, roomId: 'deluxe',
    badge: 'Save £91', image: img('1566073771259-6a8506099945'),
    desc: 'Two restful nights in a Royal Deluxe Room with breakfast and spa access.',
    includes: ['2 nights in a Royal Deluxe Room', 'Full English breakfast daily', 'Spa access for two guests', 'Late check-out until 2 pm'],
    unitText: 'per room · 2 nights'
  },
  {
    id: 'romantic', name: 'Romantic Reno Getaway', kind: 'package', nights: 2, price: 789, was: 930, roomId: 'executive',
    badge: 'Best Seller', image: img('1540555700478-4be289fbecef'),
    desc: 'Champagne, fine dining and a couples treatment in our Executive Suite.',
    includes: ['2 nights in a Reno Spa Executive Suite', 'Champagne & chocolates on arrival', '3-course dinner for two at The Royal Crown', 'Couples 60-minute spa treatment'],
    unitText: 'per suite · 2 nights'
  },
  {
    id: 'afternoon', name: 'Afternoon Tea Experience', kind: 'perGuest', nights: 0, price: 65, was: 0, roomId: null,
    badge: 'Signature', image: img('1576618148400-f54bed99fcfd'),
    desc: 'A champagne afternoon tea beneath the glass roof of our Winter Garden.',
    includes: ['Glass of champagne on arrival', 'Finger sandwiches, scones & pastries', 'Unlimited Royal Blend teas', 'Live harp music at weekends'],
    unitText: 'per guest · served 12:00 – 17:00'
  }
];

const GALLERY = [
  { src: img('1542314831-068cd1dbfeeb', 1600), title: 'Hotel Exterior', size: 'g-tall' },
  { src: img('519167758481-83f550bb49b3'.replace(/^/, '1'), 1600), title: 'Grand Lobby', size: '' },
  { src: img('1631049307264-da0ec9d70304', 1600), title: 'Deluxe Bedroom', size: 'g-wide' },
  { src: img('1582719478250-c89cae4dc85b', 1600), title: 'Royal Suites', size: '' },
  { src: img('1517248135467-4c7edcad34c4', 1600), title: 'The Royal Crown Restaurant', size: 'g-tall' },
  { src: img('1540555700478-4be289fbecef', 1600), title: 'The Spa', size: '' },
  { src: img('1571896349842-33c89424de2d', 1600), title: 'Swimming Pool', size: 'g-wide' },
  { src: img('1513635269975-59663e0ac1ad', 1600), title: 'Mombasa Surroundings', size: '' }
];

/* ---------------------------------------------------------
   3. SMALL HELPERS
   --------------------------------------------------------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const gbp = (n) => '£' + Number(n).toLocaleString('en-GB', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function nightsBetween(a, b) {
  if (!a || !b) return 0;
  return Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 86400000);
}
function eachNight(ci, co) {
  const out = [];
  if (!ci || !co) return out;
  const d = new Date(ci + 'T00:00:00Z');
  const end = new Date(co + 'T00:00:00Z');
  while (d < end) { out.push(d.toISOString().slice(0, 10)); d.setUTCDate(d.getUTCDate() + 1); }
  return out;
}
function ukDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function fmtDateTime(iso) {
  try { return new Date(iso).toLocaleString('en-GB'); } catch (e) { return iso; }
}

/* Storage helpers (wrapped in try/catch so the site never breaks) */
function readStore(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; }
}
function writeStore(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); return true; } catch (e) { return false; }
}
const getOrders = () => readStore(CONFIG.storageKey);
const saveOrders = (list) => writeStore(CONFIG.storageKey, list);

/* App state */
const state = { search: null, adminAuthed: false, lbIndex: 0 };

/* ---------------------------------------------------------
   4. TOASTS, MODALS, SCROLL LOCK
   --------------------------------------------------------- */
function showToast(message, type = 'success') {
  const wrap = $('#toastWrap');
  const t = document.createElement('div');
  t.className = 'toast' + (type === 'error' ? ' error' : '');
  t.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i><span>${esc(message)}</span>`;
  wrap.appendChild(t);
  setTimeout(() => t.classList.add('hide'), 3400);
  setTimeout(() => t.remove(), 3900);
}

function updateScrollLock() {
  const anyModal = $$('.modal.open').length > 0 || $('#lightbox').classList.contains('open');
  const navOpen = $('#mainNav').classList.contains('open');
  document.body.classList.toggle('no-scroll', anyModal || navOpen);
}
function openModal(id) { $('#' + id).classList.add('open'); updateScrollLock(); }
function closeModal(id) { $('#' + id).classList.remove('open'); updateScrollLock(); }
function closeAllModals() { $$('.modal.open').forEach((m) => m.classList.remove('open')); updateScrollLock(); }

function setupModals() {
  $$('.modal').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-close]')) modal.classList.remove('open');
      updateScrollLock();
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closeLightbox();
      setNav(false);
    }
  });
}

/* ---------------------------------------------------------
   5. NAVIGATION (mobile hamburger, sticky header, smooth scroll)
   --------------------------------------------------------- */
function setNav(open) {
  const nav = $('#mainNav'), toggle = $('#navToggle'), backdrop = $('#navBackdrop');
  nav.classList.toggle('open', open);
  toggle.classList.toggle('open', open);
  backdrop.classList.toggle('show', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  updateScrollLock();
}

function setupNav() {
  const nav = $('#mainNav');
  $('#navToggle').addEventListener('click', () => setNav(!nav.classList.contains('open')));
  $('#navBackdrop').addEventListener('click', () => setNav(false));
  window.addEventListener('resize', () => { if (window.innerWidth > 991) setNav(false); });

  // Header turns solid navy after scrolling
  const header = $('#siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function setupSmoothAnchors() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    setNav(false);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try { history.replaceState(null, '', href); } catch (err) { /* ignore */ }
  });
}

function setupActiveLink() {
  const links = $$('.nav-link');
  const sections = links.map((l) => $(l.getAttribute('href'))).filter(Boolean);
  const update = () => {
    const y = window.scrollY + 140;
    let current = sections[0];
    sections.forEach((s) => { if (s.offsetTop <= y) current = s; });
    links.forEach((l) => l.classList.toggle('active', current && l.getAttribute('href') === '#' + current.id));
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function setupBackToTop() {
  const btn = $('#backToTop');
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 600), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------------------------------------------------------
   6. IMAGES: fallback if a photo cannot be loaded
   --------------------------------------------------------- */
function fallbackSrc(label) {
  const text = String(label || 'Luxury in Mombasa').replace(/[<>&"']/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1a33"/><stop offset="1" stop-color="#16325c"/></linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/><rect x="40" y="40" width="1120" height="720" fill="none" stroke="#c8a04a" stroke-width="2" opacity=".6"/><text x="600" y="380" text-anchor="middle" font-family="Georgia,serif" font-size="54" fill="#e6cd8b">RENO SPA</text><text x="600" y="445" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="#ffffff" opacity=".8">${text}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
function applyFallback(el) {
  if (el.dataset.fallback) return;
  el.dataset.fallback = '1';
  el.src = fallbackSrc(el.alt);
}
function fixBrokenImages() {
  document.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'IMG') applyFallback(e.target);
  }, true);
  const check = () => $$('img').forEach((im) => { if (im.complete && im.naturalWidth === 0 && im.src) applyFallback(im); });
  check();
  window.addEventListener('load', check);
}

/* ---------------------------------------------------------
   7. SCROLL ANIMATIONS + COUNTERS
   --------------------------------------------------------- */
function setupReveal() {
  const items = $$('.reveal');
  items.forEach((el) => {
    const siblings = el.parentElement ? Array.from(el.parentElement.children).filter((c) => c.classList.contains('reveal')) : [];
    const idx = Math.max(0, siblings.indexOf(el));
    el.style.setProperty('--d', (idx % 4) * 0.12 + 's');
  });
  if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('in-view')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => io.observe(el));
}

function setupCounters() {
  const counters = $$('[data-count]');
  const run = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) { counters.forEach((c) => { c.textContent = c.dataset.count + (c.dataset.suffix || ''); }); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
  }, { threshold: 0.6 });
  counters.forEach((c) => io.observe(c));
}

/* ---------------------------------------------------------
   8. AVAILABILITY LOGIC
   --------------------------------------------------------- */
function availableRooms(room, ci, co) {
  const nights = eachNight(ci, co);
  const orders = getOrders().filter((o) => o.roomId === room.id && o.status !== 'Cancelled');
  let maxBooked = 0;
  nights.forEach((n) => {
    let count = 0;
    orders.forEach((o) => { if (n >= o.checkIn && n < o.checkOut) count += o.rooms; });
    maxBooked = Math.max(maxBooked, count);
  });
  return Math.max(0, room.inventory - maxBooked);
}

function availabilityFor(room, s) {
  const perRoom = Math.ceil(s.guests / s.rooms);
  const fits = perRoom <= room.capacity;
  const left = availableRooms(room, s.ci, s.co);
  return { fits, left, ok: fits && left >= s.rooms };
}

/* ---------------------------------------------------------
   9. RENDER: ROOMS, OFFERS, GALLERY, EXTRAS
   --------------------------------------------------------- */
function renderRooms() {
  const grid = $('#roomsGrid');
  const s = state.search;
  grid.innerHTML = ROOMS.map((r) => {
    let badge = '', unavailable = false;
    if (s) {
      const a = availabilityFor(r, s);
      unavailable = !a.ok;
      if (a.ok) badge = `<span class="room-avail">${a.left <= 2 ? 'Only ' + a.left + ' left' : 'Available'}</span>`;
      else badge = `<span class="room-avail bad">${a.fits ? 'Sold out for your dates' : 'Too small for your party'}</span>`;
    }
    return `
      <article class="room-card reveal ${unavailable ? 'is-unavailable' : ''}">
        <div class="room-media">
          <img src="${r.image}" alt="${esc(r.name)}" loading="lazy">
          <span class="room-tag">${esc(r.tag)}</span>${badge}
        </div>
        <div class="room-body">
          <h3>${esc(r.name)}</h3>
          <p>${esc(r.short)}</p>
          <ul class="room-meta">
            <li><i class="fa-solid fa-user-group"></i> Up to ${r.capacity} guests</li>
            <li><i class="fa-solid fa-bed"></i> ${esc(r.bed)}</li>
            <li><i class="fa-solid fa-ruler-combined"></i> ${esc(r.size)}</li>
          </ul>
          <div class="room-foot">
            <div class="room-price"><span>From</span><strong>${gbp(r.price)}</strong><small>/ night</small></div>
            <div class="room-actions">
              <button type="button" class="btn btn-outline-dark btn-sm" data-view="${r.id}">View Room</button>
              <button type="button" class="btn btn-gold btn-sm" data-book="${r.id}" ${unavailable ? 'disabled' : ''}>Book Now</button>
            </div>
          </div>
        </div>
      </article>`;
  }).join('');
  refreshReveal();
}

function renderOffers() {
  $('#offersGrid').innerHTML = OFFERS.map((o) => `
    <article class="offer-card reveal">
      <div class="offer-media">
        <img src="${o.image}" alt="${esc(o.name)}" loading="lazy">
        <span class="offer-badge">${esc(o.badge)}</span>
      </div>
      <div class="offer-body">
        <h3>${esc(o.name)}</h3>
        <p>${esc(o.desc)}</p>
        <ul class="offer-list">${o.includes.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        <div class="offer-price">
          <strong>${gbp(o.price)}</strong>
          ${o.was ? `<s>${gbp(o.was)}</s>` : ''}
          <small>${esc(o.unitText)}</small>
        </div>
        <button type="button" class="btn btn-gold btn-block" data-offer="${o.id}">Book Offer</button>
      </div>
    </article>`).join('');
}

function renderGallery() {
  $('#galleryGrid').innerHTML = GALLERY.map((g, i) => `
    <button type="button" class="g-item ${g.size} reveal" data-lightbox="${i}" aria-label="View image: ${esc(g.title)}">
      <img src="${g.src.replace('w=1600', 'w=900')}" alt="${esc(g.title)}" loading="lazy">
      <span class="g-overlay"><i class="fa-solid fa-expand"></i><strong>${esc(g.title)}</strong></span>
    </button>`).join('');
}

function renderExtras() {
  $('#extrasGrid').innerHTML = EXTRAS.map((e) => `
    <label class="extra-item">
      <input type="checkbox" name="extras" value="${e.id}">
      <span class="extra-box"><strong>${esc(e.name)}</strong><small>${gbp(e.price)} ${esc(e.unit)}</small></span>
    </label>`).join('');
}

function populateRoomSelect() {
  const sel = $('#bkRoom');
  sel.innerHTML = `<option value="">Select a room or package</option>
    <optgroup label="Rooms & Suites">
      ${ROOMS.map((r) => `<option value="${r.id}">${esc(r.name)} – ${gbp(r.price)} / night</option>`).join('')}
    </optgroup>
    <optgroup label="Special Offers">
      ${OFFERS.map((o) => `<option value="offer:${o.id}">${esc(o.name)} – ${gbp(o.price)} ${o.kind === 'perGuest' ? 'per guest' : 'package'}</option>`).join('')}
    </optgroup>`;
}

function refreshReveal() {
  // Newly rendered cards need to be observed for scroll animation
  const items = $$('.reveal:not(.in-view)');
  if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('in-view')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); } });
  }, { threshold: 0.1 });
  items.forEach((el, i) => { el.style.setProperty('--d', (i % 4) * 0.1 + 's'); io.observe(el); });
}

/* ---------------------------------------------------------
   10. DATE INPUTS + HERO SEARCH BAR
   --------------------------------------------------------- */
function setupDates() {
  const today = todayISO();
  ['#sCheckin', '#bkCheckin'].forEach((id) => { $(id).min = today; });
  ['#sCheckout', '#bkCheckout'].forEach((id) => { $(id).min = addDays(today, 1); });

  $('#sCheckin').addEventListener('change', () => {
    const ci = $('#sCheckin').value, co = $('#sCheckout');
    if (!ci) return;
    co.min = addDays(ci, 1);
    if (!co.value || co.value <= ci) co.value = addDays(ci, 1);
  });
}

function setupSearch() {
  $('#searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const err = $('#searchError');
    const ci = $('#sCheckin').value, co = $('#sCheckout').value;
    const guests = parseInt($('#sGuests').value, 10);
    const rooms = parseInt($('#sRooms').value, 10);
    err.textContent = '';

    if (!ci || !co) { err.textContent = 'Please choose both a check-in and a check-out date.'; return; }
    if (ci < todayISO()) { err.textContent = 'Check-in date cannot be in the past.'; return; }
    if (co <= ci) { err.textContent = 'Check-out must be after check-in.'; return; }
    if (guests < rooms) { err.textContent = 'You cannot have more rooms than guests.'; return; }

    state.search = { ci, co, guests, rooms };
    showAvailability();
    $('#rooms').scrollIntoView({ behavior: 'smooth' });
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="clear-search"]')) {
      state.search = null;
      $('#availabilityMsg').classList.remove('show');
      renderRooms();
    }
  });
}

function showAvailability() {
  const s = state.search;
  if (!s) return;
  renderRooms();
  const okCount = ROOMS.filter((r) => availabilityFor(r, s).ok).length;
  const nights = nightsBetween(s.ci, s.co);
  const box = $('#availabilityMsg');
  box.innerHTML = `
    <span><i class="fa-solid fa-calendar-check" style="color:var(--gold);margin-right:8px"></i>
    <strong>${okCount} of ${ROOMS.length}</strong> room types available for ${ukDate(s.ci)} – ${ukDate(s.co)}
    (${plural(nights, 'night')}, ${plural(s.guests, 'guest')}, ${plural(s.rooms, 'room')})${okCount === 0 ? ' — please try different dates.' : '.'}</span>
    <button type="button" data-action="clear-search">Clear search</button>`;
  box.classList.add('show');
}

/* ---------------------------------------------------------
   11. PRICING ENGINE
   --------------------------------------------------------- */
function findOffer(sel) { return OFFERS.find((o) => 'offer:' + o.id === sel); }

function calcOrder(d) {
  const res = { lines: [], nights: 0, total: 0, vat: 0, roomId: null, label: '', unitPrice: 0, needsDates: false, isOffer: false, capacity: null };
  const sel = d.selection;
  if (!sel) return res;
  const guests = Math.max(1, parseInt(d.guests, 10) || 1);
  const rooms = Math.max(1, parseInt(d.rooms, 10) || 1);
  let nights = 0;

  if (sel.startsWith('offer:')) {
    const o = findOffer(sel);
    if (!o) return res;
    res.isOffer = true; res.label = o.name; res.unitPrice = o.price;
    if (o.kind === 'package') {
      nights = o.nights; res.roomId = o.roomId;
      const room = ROOMS.find((r) => r.id === o.roomId);
      res.capacity = room ? room.capacity : null;
      res.lines.push({ type: 'room', item: `${o.name} (${room ? room.name : ''}, ${plural(o.nights, 'night')})`, qty: rooms, unit: o.price, total: o.price * rooms, unitText: plural(rooms, 'room') });
    } else {
      res.lines.push({ type: 'room', item: o.name, qty: guests, unit: o.price, total: o.price * guests, unitText: plural(guests, 'guest') });
    }
  } else {
    const r = ROOMS.find((x) => x.id === sel);
    if (!r) return res;
    res.label = r.name; res.roomId = r.id; res.unitPrice = r.price; res.capacity = r.capacity;
    nights = Math.max(0, nightsBetween(d.ci, d.co));
    if (nights > 0) {
      res.lines.push({ type: 'room', item: r.name, qty: rooms * nights, unit: r.price, total: r.price * rooms * nights, unitText: `${plural(rooms, 'room')} × ${plural(nights, 'night')}` });
    } else {
      res.needsDates = true;
    }
  }

  (d.extras || []).forEach((id) => {
    const e = EXTRAS.find((x) => x.id === id);
    if (!e) return;
    let qty = 0;
    if (e.mode === 'guestNight') qty = guests * nights;
    else if (e.mode === 'guest') qty = guests;
    else if (e.mode === 'night') qty = nights;
    else qty = 1;
    if (qty > 0) res.lines.push({ type: 'extra', item: e.name, qty, unit: e.price, total: e.price * qty, unitText: `${qty} × ${gbp(e.price)}` });
  });

  res.nights = nights;
  res.total = res.lines.reduce((sum, l) => sum + l.total, 0);
  res.vat = Math.round((res.total * CONFIG.vatRate / (1 + CONFIG.vatRate)) * 100) / 100;
  return res;
}

/* ---------------------------------------------------------
   12. BOOKING FORM
   --------------------------------------------------------- */
function readBookingForm() {
  return {
    name: $('#bkName').value.trim(),
    email: $('#bkEmail').value.trim(),
    phone: $('#bkPhone').value.trim(),
    selection: $('#bkRoom').value,
    ci: $('#bkCheckin').value,
    co: $('#bkCheckout').value,
    guests: $('#bkGuests').value,
    rooms: $('#bkRooms').value,
    extras: $$('input[name="extras"]:checked').map((c) => c.value),
    requests: $('#bkRequests').value.trim()
  };
}

function syncSelectionUI() {
  const sel = $('#bkRoom').value;
  const ci = $('#bkCheckin'), co = $('#bkCheckout'), hint = $('#bkDateHint');
  co.disabled = false;
  hint.textContent = '';
  if (sel.startsWith('offer:')) {
    const o = findOffer(sel);
    if (o && o.kind === 'package') {
      co.disabled = true;
      co.value = ci.value ? addDays(ci.value, o.nights) : '';
      hint.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${esc(o.name)} includes ${o.nights} nights, so your check-out date is set automatically.`;
    } else if (o) {
      co.disabled = true;
      co.value = '';
      hint.innerHTML = '<i class="fa-solid fa-circle-info"></i> Afternoon tea is a same-day experience. Just choose your date (served 12:00 – 17:00).';
    }
  } else {
    co.min = addDays(ci.value || todayISO(), 1);
    if (co.value && ci.value && co.value <= ci.value) co.value = '';
  }
}

function updateSummary() {
  const box = $('#orderSummary');
  const d = readBookingForm();
  const c = calcOrder(d);

  if (!d.selection) {
    box.innerHTML = `<div class="sum-empty"><i class="fa-solid fa-hotel"></i>Select a room or package to see your price.</div>`;
    return;
  }
  const meta = [];
  if (c.nights > 0) meta.push(plural(c.nights, 'night'));
  meta.push(plural(parseInt(d.guests, 10) || 1, 'guest'));
  if (!(d.selection === 'offer:afternoon')) meta.push(plural(parseInt(d.rooms, 10) || 1, 'room'));

  let html = `<p class="sum-meta"><strong style="color:#fff">${esc(c.label)}</strong><br>${meta.join(' · ')}${d.ci ? ' · ' + ukDate(d.ci) + (d.co ? ' → ' + ukDate(d.co) : '') : ''}</p>`;

  if (c.needsDates) {
    html += `<div class="sum-line"><span>${esc(c.label)}<small>${gbp(c.unitPrice)} per night</small></span><b>Choose dates</b></div>`;
  }
  html += c.lines.map((l) => `
    <div class="sum-line"><span>${esc(l.item)}<small>${esc(l.unitText)}</small></span><b>${gbp(l.total)}</b></div>`).join('');

  if (c.lines.length) {
    html += `
      <div class="sum-total"><span>Total</span><strong>${gbp(c.total)}</strong></div>
      <p class="sum-vat">Includes VAT (20%) of ${gbp(c.vat)}</p>
      <div class="sum-note"><i class="fa-solid fa-shield-halved"></i> Free cancellation up to 48 hours before arrival. Pay at the hotel.</div>`;
  }
  box.innerHTML = html;
}

/* Error helpers */
function showError(el, msg) {
  const f = el.closest('.field');
  if (!f) return;
  f.classList.add('has-error');
  const m = $('.error-msg', f);
  if (m) m.textContent = msg;
  el.setAttribute('aria-invalid', 'true');
}
function clearError(el) {
  const f = el.closest('.field');
  if (!f) return;
  f.classList.remove('has-error');
  const m = $('.error-msg', f);
  if (m) m.textContent = '';
  el.removeAttribute('aria-invalid');
}
function clearAllErrors(form) { $$('.field', form).forEach((f) => { f.classList.remove('has-error'); const m = $('.error-msg', f); if (m) m.textContent = ''; }); }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isPhone = (v) => /^[+()\d\s\-]{7,22}$/.test(v) && v.replace(/\D/g, '').length >= 7;

function validateBooking(d) {
  clearAllErrors($('#bookingForm'));
  let firstBad = null;
  const fail = (el, msg) => { showError(el, msg); if (!firstBad) firstBad = el; };

  if (d.name.length < 2) fail($('#bkName'), 'Please enter your full name.');
  if (!EMAIL_RE.test(d.email)) fail($('#bkEmail'), 'Please enter a valid email address.');
  if (!isPhone(d.phone)) fail($('#bkPhone'), 'Please enter a valid phone number.');
  if (!d.selection) fail($('#bkRoom'), 'Please choose a room or package.');

  const isTea = d.selection === 'offer:afternoon';
  if (!d.ci) fail($('#bkCheckin'), isTea ? 'Please choose your date.' : 'Please choose a check-in date.');
  else if (d.ci < todayISO()) fail($('#bkCheckin'), 'Date cannot be in the past.');

  if (!isTea) {
    if (!d.co) fail($('#bkCheckout'), 'Please choose a check-out date.');
    else if (d.ci && d.co <= d.ci) fail($('#bkCheckout'), 'Check-out must be after check-in.');
  }

  const guests = parseInt(d.guests, 10), rooms = parseInt(d.rooms, 10);
  if (!guests || guests < 1 || guests > 12) fail($('#bkGuests'), 'Guests must be between 1 and 12.');
  if (!isTea && guests < rooms) fail($('#bkRooms'), 'You cannot book more rooms than guests.');

  const c = calcOrder(d);
  if (d.selection && !isTea && c.capacity && guests && rooms && Math.ceil(guests / rooms) > c.capacity) {
    fail($('#bkGuests'), `This room sleeps up to ${c.capacity} guests. Add more rooms or choose a larger suite.`);
  }
  if (c.roomId && d.ci && d.co && d.co > d.ci && !firstBad) {
    const room = ROOMS.find((r) => r.id === c.roomId);
    const left = availableRooms(room, d.ci, d.co);
    if (left < rooms) fail($('#bkRoom'), left === 0 ? 'Sorry, this room is fully booked for those dates.' : `Only ${plural(left, 'room')} left for those dates.`);
  }
  if (!$('#bkTerms').checked) fail($('#bkTerms'), 'Please accept the booking terms to continue.');

  if (firstBad) { firstBad.focus(); return false; }
  return true;
}

function makeRef() {
  const d = new Date();
  const ymd = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RS-${ymd}-${rand}`;
}

function createOrder(d, c) {
  const roomLine = c.lines.find((l) => l.type === 'room');
  const roomTotal = roomLine ? roomLine.total : 0;
  const isTea = d.selection === 'offer:afternoon';
  return {
    ref: makeRef(),
    placedAt: new Date().toISOString(),
    guestName: d.name, email: d.email, phone: d.phone,
    checkIn: d.ci, checkOut: isTea ? d.ci : d.co,
    nights: c.nights,
    guests: parseInt(d.guests, 10), rooms: isTea ? 0 : parseInt(d.rooms, 10),
    selection: d.selection, roomId: c.roomId, roomType: c.label, unitPrice: c.unitPrice,
    roomTotal,
    extras: c.lines.filter((l) => l.type === 'extra').map((l) => `${l.item} (${gbp(l.total)})`),
    extrasTotal: Math.round((c.total - roomTotal) * 100) / 100,
    total: c.total, vat: c.vat,
    requests: d.requests,
    lines: c.lines,
    status: 'Confirmed'
  };
}

function setupBooking() {
  const form = $('#bookingForm');
  form.addEventListener('input', (e) => { clearError(e.target); });
  form.addEventListener('change', (e) => { clearError(e.target); });
  ['input', 'change'].forEach((evt) => form.addEventListener(evt, () => { syncSelectionUI(); updateSummary(); }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = readBookingForm();
    if (!validateBooking(d)) { showToast('Please check the highlighted fields.', 'error'); return; }
    const c = calcOrder(d);
    const order = createOrder(d, c);

    const list = getOrders();
    list.push(order);
    if (!saveOrders(list)) showToast('Your browser blocked saving. Please allow site storage.', 'error');
    sendToGoogleSheet(order);

    form.reset();
    syncSelectionUI();
    updateSummary();
    showConfirmation(order);
    if (state.search) showAvailability();
  });

  syncSelectionUI();
  updateSummary();
}

/* Choose a room / offer from the rest of the page */
function chooseSelection(value, label) {
  closeAllModals();
  const sel = $('#bkRoom');
  sel.value = value;
  // Carry over dates/guests from the hero search if user has not typed any yet
  if (state.search) {
    if (!$('#bkCheckin').value) $('#bkCheckin').value = state.search.ci;
    if (!$('#bkCheckout').value) $('#bkCheckout').value = state.search.co;
    $('#bkGuests').value = state.search.guests;
    $('#bkRooms').value = state.search.rooms;
  }
  clearAllErrors($('#bookingForm'));
  syncSelectionUI();
  updateSummary();
  $('#booking').scrollIntoView({ behavior: 'smooth' });
  showToast(`${label} added to your booking`);
}

/* ---------------------------------------------------------
   13. ROOM MODAL, CONFIRMATION MODAL
   --------------------------------------------------------- */
function openRoomModal(id) {
  const r = ROOMS.find((x) => x.id === id);
  if (!r) return;
  let availHtml = '';
  if (state.search) {
    const a = availabilityFor(r, state.search);
    availHtml = `<p class="date-hint" style="margin:0 0 14px"><i class="fa-solid fa-calendar-check"></i> ${a.ok ? 'Available for your selected dates' : (a.fits ? 'Sold out for your selected dates' : 'Too small for your party size')}</p>`;
  }
  $('#roomModalBody').innerHTML = `
    <div class="rm-grid">
      <div class="rm-img"><img src="${r.image}" alt="${esc(r.name)}"></div>
      <div class="rm-info">
        <p class="eyebrow" style="margin-bottom:6px">${esc(r.tag)}</p>
        <h3 style="text-align:left">${esc(r.name)}</h3>
        <ul class="room-meta">
          <li><i class="fa-solid fa-user-group"></i> Up to ${r.capacity} guests</li>
          <li><i class="fa-solid fa-bed"></i> ${esc(r.bed)}</li>
          <li><i class="fa-solid fa-ruler-combined"></i> ${esc(r.size)}</li>
        </ul>
        <p>${esc(r.short)}</p>
        <ul class="rm-features">${r.features.map((f) => `<li><i class="fa-solid fa-check"></i>${esc(f)}</li>`).join('')}</ul>
        ${availHtml}
        <div class="rm-price">${gbp(r.price)} <small>per night · VAT included</small></div>
        <button type="button" class="btn btn-gold btn-block" data-book="${r.id}">Book This Room</button>
      </div>
    </div>`;
  openModal('roomModal');
}

function showConfirmation(order) {
  const first = order.guestName.split(' ')[0];
  const isTea = order.selection === 'offer:afternoon';
  $('#confirmBody').innerHTML = `
    <div class="confirm-icon"><i class="fa-solid fa-check"></i></div>
    <h3>Thank you, ${esc(first)}!</h3>
    <p class="modal-sub">Your booking is confirmed and has been registered.</p>
    <div class="ref-box"><span>Booking reference</span><strong>${esc(order.ref)}</strong></div>
    <div class="confirm-info">
      <b>${esc(order.roomType)}</b><br>
      ${isTea ? 'Date: ' + ukDate(order.checkIn) : `${ukDate(order.checkIn)} → ${ukDate(order.checkOut)} (${plural(order.nights, 'night')})`}
      · ${plural(order.guests, 'guest')}${isTea ? '' : ' · ' + plural(order.rooms, 'room')}<br>
      <b>${esc(order.guestName)}</b> · ${esc(order.email)} · ${esc(order.phone)}
    </div>
    <table class="receipt">
      ${order.lines.map((l) => `<tr><td>${esc(l.item)}<small>${esc(l.unitText)}</small></td><td>${gbp(l.total)}</td></tr>`).join('')}
      <tr class="total"><td>Total (incl. VAT ${gbp(order.vat)})</td><td>${gbp(order.total)}</td></tr>
    </table>
    <div class="confirm-actions no-print">
      <button type="button" class="btn btn-gold btn-sm" data-download-order="${esc(order.ref)}"><i class="fa-solid fa-file-excel"></i> Download Excel</button>
      <button type="button" class="btn btn-outline-dark btn-sm" data-print><i class="fa-solid fa-print"></i> Print</button>
      <button type="button" class="btn btn-navy btn-sm" data-close>Close</button>
    </div>
    <p class="fine-print">Payment is taken at the hotel. Free cancellation up to 48 hours before arrival.</p>`;
  openModal('confirmModal');
}

/* ---------------------------------------------------------
   14. EXCEL EXPORT  (SheetJS)  +  OPTIONAL GOOGLE SHEETS
   --------------------------------------------------------- */
const BOOKING_HEADERS = ['Reference', 'Date Placed', 'Guest Name', 'Email', 'Phone', 'Check-in', 'Check-out', 'Nights', 'Guests', 'Rooms', 'Room / Package', 'Price per Night or Package (£)', 'Room Total (£)', 'Extras', 'Extras Total (£)', 'Total incl. VAT (£)', 'VAT Included (£)', 'Special Requests', 'Status'];
const LINE_HEADERS = ['Reference', 'Guest Name', 'Item', 'Type', 'Quantity', 'Unit Price (£)', 'Line Total (£)'];

function makeSheet(headers, rows) {
  const ws = XLSX.utils.aoa_to_sheet([headers].concat(rows));
  ws['!cols'] = headers.map((h, i) => {
    let w = h.length + 4;
    rows.forEach((r) => { w = Math.max(w, String(r[i] == null ? '' : r[i]).length + 2); });
    return { wch: Math.min(w, 60) };
  });
  return ws;
}

function buildWorkbook(orders, full) {
  const wb = XLSX.utils.book_new();
  const bookingRows = orders.map((o) => [
    o.ref, fmtDateTime(o.placedAt), o.guestName, o.email, o.phone, ukDate(o.checkIn), ukDate(o.checkOut), o.nights, o.guests, o.rooms,
    o.roomType, o.unitPrice, o.roomTotal, o.extras.join(', '), o.extrasTotal, o.total, o.vat, o.requests, o.status
  ]);
  XLSX.utils.book_append_sheet(wb, makeSheet(BOOKING_HEADERS, bookingRows), 'Bookings');

  const lineRows = [];
  orders.forEach((o) => o.lines.forEach((l) => lineRows.push([o.ref, o.guestName, l.item, l.type === 'room' ? 'Room / Package' : 'Extra', l.qty, l.unit, l.total])));
  XLSX.utils.book_append_sheet(wb, makeSheet(LINE_HEADERS, lineRows), 'Order Lines');

  if (full) {
    const enq = readStore(CONFIG.enquiryKey).map((q) => [fmtDateTime(q.at), q.name, q.email, q.phone, q.message]);
    XLSX.utils.book_append_sheet(wb, makeSheet(['Date', 'Name', 'Email', 'Phone', 'Message'], enq), 'Enquiries');
    const nl = readStore(CONFIG.newsletterKey).map((n) => [fmtDateTime(n.at), n.email]);
    XLSX.utils.book_append_sheet(wb, makeSheet(['Date', 'Email'], nl), 'Newsletter');
  }
  return wb;
}

function downloadWorkbook(orders, filename, full) {
  if (typeof XLSX === 'undefined') { showToast('Excel library could not load. Check your internet connection.', 'error'); return; }
  try {
    XLSX.writeFile(buildWorkbook(orders, full), filename);
    showToast('Excel file downloaded');
  } catch (err) {
    showToast('Could not create the Excel file.', 'error');
  }
}

function sendToGoogleSheet(o) {
  if (!CONFIG.googleSheetsWebhook) return;
  const flat = {
    Reference: o.ref, DatePlaced: fmtDateTime(o.placedAt), GuestName: o.guestName, Email: o.email, Phone: o.phone,
    CheckIn: ukDate(o.checkIn), CheckOut: ukDate(o.checkOut), Nights: o.nights, Guests: o.guests, Rooms: o.rooms,
    RoomOrPackage: o.roomType, PricePerNightOrPackage: o.unitPrice, RoomTotal: o.roomTotal,
    Extras: o.extras.join(', '), ExtrasTotal: o.extrasTotal, TotalInclVAT: o.total, VATIncluded: o.vat,
    SpecialRequests: o.requests, Status: o.status
  };
  fetch(CONFIG.googleSheetsWebhook, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(flat)
  }).catch(() => { /* ignore network errors */ });
}

/* ---------------------------------------------------------
   15. STAFF / ADMIN AREA
   --------------------------------------------------------- */
function renderAdmin() {
  const body = $('#adminBody');
  if (!state.adminAuthed) {
    body.innerHTML = `
      <div class="admin-login">
        <div class="confirm-icon gold"><i class="fa-solid fa-lock"></i></div>
        <h3>Staff Login</h3>
        <p class="modal-sub">Enter the staff password to view and export bookings.</p>
        <form id="adminLoginForm" novalidate>
          <div class="field">
            <label for="adminPass">Password</label>
            <input type="password" id="adminPass" autocomplete="current-password">
            <span class="error-msg"></span>
          </div>
          <button type="submit" class="btn btn-gold btn-block">Log in</button>
        </form>
      </div>`;
    return;
  }
  const orders = getOrders().slice().reverse();
  const active = orders.filter((o) => o.status !== 'Cancelled');
  const revenue = active.reduce((s, o) => s + o.total, 0);
  const rows = orders.map((o) => `
    <tr>
      <td><strong>${esc(o.ref)}</strong><br><small>${esc(fmtDateTime(o.placedAt))}</small></td>
      <td>${esc(o.guestName)}<br><small>${esc(o.email)}<br>${esc(o.phone)}</small></td>
      <td>${esc(o.roomType)}<br><small>${o.extras.length ? esc(o.extras.join(', ')) : 'No extras'}</small></td>
      <td>${ukDate(o.checkIn)}${o.checkOut && o.checkOut !== o.checkIn ? '<br>→ ' + ukDate(o.checkOut) : ''}</td>
      <td>${o.guests} / ${o.rooms}</td>
      <td><strong>${gbp(o.total)}</strong></td>
      <td><span class="status-pill ${o.status === 'Cancelled' ? 'cancelled' : ''}">${esc(o.status)}</span></td>
      <td>${o.status === 'Cancelled' ? '' : `<button type="button" class="mini-btn" data-cancel="${esc(o.ref)}">Cancel</button>`}</td>
    </tr>`).join('');

  body.innerHTML = `
    <h3 style="text-align:left">Bookings Dashboard</h3>
    <p class="modal-sub" style="text-align:left">Bookings are stored in this browser. Download them as an Excel file at any time.</p>
    <div class="admin-stats">
      <div class="admin-stat"><strong>${orders.length}</strong><span>Total bookings</span></div>
      <div class="admin-stat"><strong>${active.length}</strong><span>Active bookings</span></div>
      <div class="admin-stat"><strong>${gbp(revenue)}</strong><span>Active revenue</span></div>
    </div>
    <div class="admin-actions">
      <button type="button" class="btn btn-gold btn-sm" data-admin="download"><i class="fa-solid fa-file-excel"></i> Download Excel (.xlsx)</button>
      <button type="button" class="btn btn-outline-dark btn-sm" data-admin="clear"><i class="fa-solid fa-trash"></i> Clear all data</button>
      <button type="button" class="btn btn-outline-dark btn-sm" data-admin="logout"><i class="fa-solid fa-right-from-bracket"></i> Log out</button>
    </div>
    ${orders.length ? `
    <div class="table-wrap">
      <table class="admin-table">
        <thead><tr><th>Reference</th><th>Guest</th><th>Room / Extras</th><th>Dates</th><th>Guests / Rooms</th><th>Total</th><th>Status</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>` : `<div class="empty-state"><i class="fa-regular fa-folder-open" style="font-size:2rem;color:var(--gold)"></i><p>No bookings yet. Make a test booking on the website and it will appear here.</p></div>`}`;
}

function setupAdmin() {
  $('#adminOpen').addEventListener('click', () => { renderAdmin(); openModal('adminModal'); });

  document.addEventListener('submit', (e) => {
    if (e.target.id !== 'adminLoginForm') return;
    e.preventDefault();
    const input = $('#adminPass');
    if (input.value === CONFIG.adminPassword) { state.adminAuthed = true; renderAdmin(); }
    else { showError(input, 'Incorrect password.'); }
  });

  document.addEventListener('click', (e) => {
    const act = e.target.closest('[data-admin]');
    if (act) {
      const type = act.dataset.admin;
      if (type === 'download') downloadWorkbook(getOrders(), `Reno-Spa-Bookings-${todayISO()}.xlsx`, true);
      if (type === 'logout') { state.adminAuthed = false; renderAdmin(); }
      if (type === 'clear') {
        if (window.confirm('Delete ALL bookings, enquiries and newsletter sign-ups stored in this browser? This cannot be undone.')) {
          [CONFIG.storageKey, CONFIG.enquiryKey, CONFIG.newsletterKey].forEach((k) => { try { localStorage.removeItem(k); } catch (err) { /* ignore */ } });
          renderAdmin(); renderRooms(); if (state.search) showAvailability();
          showToast('All stored data cleared');
        }
      }
    }
    const cancel = e.target.closest('[data-cancel]');
    if (cancel) {
      const list = getOrders();
      const o = list.find((x) => x.ref === cancel.dataset.cancel);
      if (o && window.confirm(`Cancel booking ${o.ref}?`)) {
        o.status = 'Cancelled'; saveOrders(list); renderAdmin(); renderRooms();
        if (state.search) showAvailability();
        showToast('Booking cancelled');
      }
    }
  });
}

/* ---------------------------------------------------------
   16. CONTACT FORM + NEWSLETTER
   --------------------------------------------------------- */
function setupContact() {
  const form = $('#contactForm');
  form.addEventListener('input', (e) => clearError(e.target));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors(form);
    const name = $('#ctName').value.trim(), email = $('#ctEmail').value.trim();
    const phone = $('#ctPhone').value.trim(), message = $('#ctMessage').value.trim();
    let firstBad = null;
    const fail = (el, msg) => { showError(el, msg); if (!firstBad) firstBad = el; };

    if (name.length < 2) fail($('#ctName'), 'Please enter your name.');
    if (!EMAIL_RE.test(email)) fail($('#ctEmail'), 'Please enter a valid email address.');
    if (phone && !isPhone(phone)) fail($('#ctPhone'), 'Please enter a valid phone number or leave it blank.');
    if (message.length < 10) fail($('#ctMessage'), 'Please write a message (at least 10 characters).');
    if (firstBad) { firstBad.focus(); showToast('Please check the highlighted fields.', 'error'); return; }

    const list = readStore(CONFIG.enquiryKey);
    list.push({ at: new Date().toISOString(), name, email, phone, message });
    writeStore(CONFIG.enquiryKey, list);
    form.reset();
    showToast(`Thank you, ${name.split(' ')[0]}. Our team will reply within 24 hours.`);
  });
}

function setupNewsletter() {
  const form = $('#newsletterForm');
  form.addEventListener('input', (e) => clearError(e.target));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#nlEmail');
    const email = input.value.trim();
    if (!EMAIL_RE.test(email)) { showError(input, 'Please enter a valid email.'); return; }
    const list = readStore(CONFIG.newsletterKey);
    if (!list.some((n) => n.email.toLowerCase() === email.toLowerCase())) {
      list.push({ at: new Date().toISOString(), email });
      writeStore(CONFIG.newsletterKey, list);
    }
    form.reset();
    showToast('Subscribed! Welcome to Reno Spa.');
  });
}

/* ---------------------------------------------------------
   17. LIGHTBOX (gallery)
   --------------------------------------------------------- */
function showLightbox(i) {
  const n = GALLERY.length;
  state.lbIndex = (i + n) % n;
  const g = GALLERY[state.lbIndex];
  const im = $('#lbImg');
  delete im.dataset.fallback;
  im.src = g.src;
  im.alt = g.title;
  $('#lbCaption').textContent = g.title;
  $('#lbCount').textContent = `${state.lbIndex + 1} / ${n}`;
}
function openLightbox(i) {
  showLightbox(i);
  $('#lightbox').classList.add('open');
  updateScrollLock();
  $('#lbClose').focus();
}
function closeLightbox() {
  $('#lightbox').classList.remove('open');
  updateScrollLock();
}
function setupLightbox() {
  $('#lbClose').addEventListener('click', closeLightbox);
  $('#lbPrev').addEventListener('click', () => showLightbox(state.lbIndex - 1));
  $('#lbNext').addEventListener('click', () => showLightbox(state.lbIndex + 1));
  $('#lightbox').addEventListener('click', (e) => { if (e.target.id === 'lightbox') closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!$('#lightbox').classList.contains('open')) return;
    if (e.key === 'ArrowLeft') showLightbox(state.lbIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(state.lbIndex + 1);
  });
  // Swipe on phones
  let startX = 0;
  $('#lightbox').addEventListener('touchstart', (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
  $('#lightbox').addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) showLightbox(state.lbIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });
}

/* ---------------------------------------------------------
   18. BUTTONS THAT USE data-* ATTRIBUTES
   --------------------------------------------------------- */
function setupDelegatedActions() {
  document.addEventListener('click', (e) => {
    const view = e.target.closest('[data-view]');
    if (view) { openRoomModal(view.dataset.view); return; }

    const book = e.target.closest('[data-book]');
    if (book) {
      const r = ROOMS.find((x) => x.id === book.dataset.book);
      if (r) chooseSelection(r.id, r.name);
      return;
    }
    const offer = e.target.closest('[data-offer]');
    if (offer) {
      const o = OFFERS.find((x) => x.id === offer.dataset.offer);
      if (o) chooseSelection('offer:' + o.id, o.name);
      return;
    }
    const lb = e.target.closest('[data-lightbox]');
    if (lb) { openLightbox(parseInt(lb.dataset.lightbox, 10)); return; }

    const dl = e.target.closest('[data-download-order]');
    if (dl) {
      const o = getOrders().find((x) => x.ref === dl.dataset.downloadOrder);
      if (o) downloadWorkbook([o], `Booking-${o.ref}.xlsx`, false);
      return;
    }
    if (e.target.closest('[data-print]')) window.print();
  });
}

/* ---------------------------------------------------------
   19. START EVERYTHING
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderRooms();
  renderOffers();
  renderGallery();
  renderExtras();
  populateRoomSelect();

  setupNav();
  setupSmoothAnchors();
  setupActiveLink();
  setupBackToTop();
  setupDates();
  setupSearch();
  setupBooking();
  setupContact();
  setupNewsletter();
  setupModals();
  setupLightbox();
  setupAdmin();
  setupDelegatedActions();
  setupReveal();
  setupCounters();
  fixBrokenImages();

  $('#year').textContent = new Date().getFullYear();
});