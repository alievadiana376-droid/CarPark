/* CarPark — site logic: language, currency, hero slider, catalog, modal, FAQ, booking form. */
(() => {
  'use strict';

  /* ---------- Contacts: replace with real data ---------- */
  const CONTACTS = {
    phone: '+373 600 000 00',
    phoneRaw: '+37360000000',      // digits only, used for tel: and WhatsApp
    telegram: 'carpark_md',         // Telegram username without @
    instagram: 'carpark.md',
    facebook: 'carpark.md',
    google: 'https://www.google.com/maps/search/CarPark+Chisinau',
    airport: 'https://www.google.com/maps/search/Chisinau+International+Airport'
  };

  /* ---------- Google sign-in: paste the OAuth Client ID from Google Cloud Console ----------
     (APIs & Services → Credentials → OAuth client ID → Web application,
      add your site address to "Authorized JavaScript origins"). Empty = sign-in shows "coming soon". */
  const GOOGLE_CLIENT_ID = '';

  /* ---------- "Notify me" emails for upcoming services ----------
     Paste a form endpoint here (e.g. a Formspree form URL) to collect emails.
     Empty = the email is sent to you as a WhatsApp message instead. */
  const NOTIFY_ENDPOINT = '';

  /* ---------- Currency: how many MDL is one unit (update regularly) ---------- */
  const RATES = { MDL: 1, EUR: 19.5, USD: 17.5, UAH: 0.42 };
  const CURRENCIES = {
    MDL: { symbol: 'L', label: 'MDL — lei' },
    EUR: { symbol: '€', label: 'EUR — euro' },
    USD: { symbol: '$', label: 'USD — dollar' },
    UAH: { symbol: '₴', label: 'UAH — гривня' }
  };
  const LANGS = { ro: 'Română', ru: 'Русский', en: 'English' };
  const LOCALES = { ro: 'ro-MD', ru: 'ru-RU', en: 'en-GB' };

  /* ---------- Fleet (prices per day in MDL) ---------- */
  const img = (file) => encodeURI(`cars/${file}`);
  const HERO_CAR = {
    id: 'amg-gt63', brand: 'Mercedes', name: 'Mercedes-AMG GT 63 S', img: 'car.png', photo: true,
    year: 2023, engine: '4.0 V8', hp: 639, accel: 3.2, top: 315, seats: 4, fuel: 'petrol', price: 5900,
    desc: {
      ro: 'Un supercar cu patru uși: forța unui V8 biturbo, interior de lux și o dinamică care îți taie respirația.',
      ru: 'Четырёхдверный суперкар: мощь V8 biturbo, роскошный салон и динамика, от которой захватывает дух.',
      en: 'A four-door supercar: V8 biturbo power, a luxurious cabin and breathtaking performance.'
    }
  };
  const CARS = [
    {
      id: 'rsq8-performance', brand: 'Audi', name: 'Audi RS Q8 Performance', img: img('ChatGPT Image Sep 28, 2026 at 10_52_49 PM.png'),
      year: 2024, engine: '4.0 V8', hp: 640, accel: 3.6, top: 305, seats: 5, fuel: 'petrol', price: 5400,
      desc: {
        ro: 'Cel mai puternic SUV Audi: 640 CP, șasiu sport și confort de clasă business.',
        ru: 'Самый мощный кроссовер Audi: 640 л.с., спортивное шасси и комфорт бизнес-класса.',
        en: "Audi's most powerful SUV: 640 hp, a sport chassis and business-class comfort."
      }
    },
    {
      id: 'rsq8', brand: 'Audi', name: 'Audi RS Q8', img: img('ChatGPT Image Sep 28, 2026 at 10_50_53 PM.png'),
      year: 2023, engine: '4.0 V8', hp: 600, accel: 3.8, top: 250, seats: 5, fuel: 'petrol', price: 4900,
      desc: {
        ro: 'Stil agresiv și V8 sub capotă — ideal pentru cei care iubesc atenția pe drum.',
        ru: 'Агрессивный стиль и V8 под капотом — для тех, кто любит внимание на дороге.',
        en: 'Aggressive styling and a V8 under the hood — for those who love attention on the road.'
      }
    },
    {
      id: 'm850i', brand: 'BMW', name: 'BMW M850i Gran Coupé', img: img('ChatGPT Image Sep 28, 2026 at 10_53_50 PM.png'),
      year: 2022, engine: '4.4 V8', hp: 530, accel: 3.9, top: 250, seats: 5, fuel: 'petrol', price: 4500,
      desc: {
        ro: 'Coupé cu patru uși și V8: un grand tourer pentru drumuri cu confort și caracter.',
        ru: 'Элегантное четырёхдверное купе с V8: гран-турер для поездок с комфортом и характером.',
        en: 'An elegant four-door coupé with a V8: a grand tourer with comfort and character.'
      }
    },
    {
      id: 'cayenne-s', brand: 'Porsche', name: 'Porsche Cayenne S', img: img('ChatGPT Image Sep 28, 2026 at 10_55_45 PM.png'),
      year: 2018, engine: '3.6 V6', hp: 420, accel: 5.5, top: 259, seats: 5, fuel: 'petrol', price: 3200,
      desc: {
        ro: 'Caracterul sportiv Porsche într-un SUV premium pentru oraș și autostradă.',
        ru: 'Спортивный характер Porsche в формате премиального SUV для города и трассы.',
        en: "Porsche's sporty character in a premium SUV for city and highway."
      }
    },
    {
      id: 'ram-1500', brand: 'RAM', name: 'RAM 1500 Laramie', img: img('ChatGPT Image Sep 28, 2026 at 10_49_36 PM.png'), glow: true,
      year: 2022, engine: '5.7 V8 HEMI', hp: 395, accel: 6.6, top: 180, seats: 5, fuel: 'petrol', price: 2600,
      desc: {
        ro: 'Pickup full-size cu V8 HEMI: putere, spațiu și confort pentru orice misiune.',
        ru: 'Полноразмерный пикап с V8 HEMI: мощь, простор и комфорт для любых задач.',
        en: 'A full-size pickup with a V8 HEMI: power, space and comfort for any job.'
      }
    },
    {
      id: 'xc90', brand: 'Volvo', name: 'Volvo XC90 B5 AWD', img: img('ChatGPT Image Sep 28, 2026 at 10_48_06 PM.png'), glow: true,
      year: 2023, engine: '2.0 Mild Hybrid', hp: 250, accel: 7.7, top: 180, seats: 7, fuel: 'hybrid', price: 2400,
      desc: {
        ro: 'Șapte locuri, confort scandinav și siguranță — alegerea ideală pentru familie și călătorii.',
        ru: 'Семь мест, скандинавский комфорт и безопасность — лучший выбор для семьи и путешествий.',
        en: 'Seven seats, Scandinavian comfort and safety — the best choice for families and trips.'
      }
    }
  ];
  const ALL_CARS = [HERO_CAR, ...CARS];
  const BRANDS = [
    { name: 'Mercedes', icon: 'mercedes' },
    { name: 'BMW', icon: 'bmw' },
    { name: 'Audi', icon: 'audi' },
    { name: 'RAM', icon: 'ram' },
    { name: 'Volvo', icon: 'volvo' },
    { name: 'Porsche', icon: 'porsche' }
  ];
  const ICON_CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@13/icons/';
  const CATALOG_INITIAL = 3;

  /* ---------- State ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }
  };
  const state = {
    lang: pickLang(),
    currency: CURRENCIES[store.get('cp.currency')] ? store.get('cp.currency') : 'MDL',
    slide: 0,
    brand: 'all',
    query: '',
    sort: 'default',
    expanded: false
  };

  function pickLang() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (LANGS[fromUrl]) return fromUrl;
    const saved = store.get('cp.lang');
    if (LANGS[saved]) return saved;
    const nav = (navigator.language || '').slice(0, 2);
    return LANGS[nav] ? nav : 'ro';
  }

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  function t(key, vars) {
    const dict = window.I18N[state.lang] || {};
    let str = dict[key] ?? window.I18N.ro[key];
    if (str === undefined) { console.warn('[i18n] missing key:', key); return key; }
    if (vars) str = str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
    return str;
  }

  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Money ---------- */
  function priceParts(mdl) {
    const code = state.currency;
    let v = mdl / RATES[code];
    const step = code === 'MDL' || code === 'UAH' ? (v >= 10000 ? 100 : 50) : (v >= 1000 ? 10 : 5);
    v = Math.round(v / step) * step;
    const n = new Intl.NumberFormat(LOCALES[state.lang], { maximumFractionDigits: 0 }).format(v);
    const sym = code === 'MDL' ? 'lei' : CURRENCIES[code].symbol;
    return { n, sym, prefix: code === 'USD' };
  }
  function price(mdl) {
    const p = priceParts(mdl);
    return p.prefix ? `${p.sym}${p.n}` : `${p.n} ${p.sym}`;
  }
  // Price row for cards and modal: bare numbers, currency shown in the labels so long totals fit
  function priceRow(car, extraClass = '') {
    const p = priceDays(car);
    const sym = priceParts(0).sym;
    const cell = (v, label) => `<div><b>${priceParts(v).n}</b><span>${t(label)}, ${sym}</span></div>`;
    return `<div class="car__prices${extraClass}">${cell(p.day, 'price.day')}${cell(p.d14, 'price.14')}${cell(p.month, 'price.month')}</div>`;
  }
  const priceDays = (car) => ({ day: car.price, d14: car.price * 14 * 0.85, month: car.price * 30 * 0.7 });
  const num = (v) => new Intl.NumberFormat(LOCALES[state.lang]).format(v);
  // "YYYY-MM-DD" parsed as a local date (new Date(str) would treat it as UTC)
  const fmtDate = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString(LOCALES[state.lang]); };

  /* ---------- Links ---------- */
  function waLink(text) {
    const phone = CONTACTS.phoneRaw.replace(/\D/g, '');
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }
  function applyLinks() {
    $$('[data-link]').forEach((a) => {
      const kind = a.dataset.link;
      if (kind === 'whatsapp') a.href = waLink(t('wa.hello'));
      if (kind === 'telegram') a.href = `https://t.me/${CONTACTS.telegram}`;
      if (kind === 'instagram') a.href = `https://instagram.com/${CONTACTS.instagram}`;
      if (kind === 'facebook') a.href = `https://facebook.com/${CONTACTS.facebook}`;
      if (kind === 'google') a.href = CONTACTS.google;
      if (kind === 'airport') a.href = CONTACTS.airport;
      if (kind === 'career') a.href = waLink(t('wa.career'));
      if (kind === 'tel') a.href = `tel:${CONTACTS.phoneRaw}`;
    });
    $$('[data-contact="phone"]').forEach((el) => { el.textContent = CONTACTS.phone; });
  }

  /* ---------- i18n apply ---------- */
  function applyI18n() {
    document.documentElement.lang = state.lang;
    document.title = t('meta.title');
    $('meta[name="description"]').setAttribute('content', t('meta.desc'));
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  }

  /* ---------- Dropdowns (language / currency) ---------- */
  function renderDropdowns() {
    const cur = $('[data-dropdown="currency"]');
    $('[data-currency-symbol]', cur).textContent = CURRENCIES[state.currency].symbol;
    $('[data-currency-code]', cur).textContent = state.currency;
    $('.dropdown__menu', cur).innerHTML = Object.entries(CURRENCIES).map(([code, c]) =>
      `<li role="option" aria-selected="${code === state.currency}" data-value="${code}"><b>${c.symbol}</b>${c.label}</li>`).join('');

    const lang = $('[data-dropdown="lang"]');
    $('[data-lang-code]', lang).textContent = state.lang.toUpperCase();
    $('.dropdown__menu', lang).innerHTML = Object.entries(LANGS).map(([code, label]) =>
      `<li role="option" aria-selected="${code === state.lang}" data-value="${code}"><b>${code.toUpperCase()}</b>${label}</li>`).join('');
  }

  function initDropdowns() {
    $$('.dropdown').forEach((dd) => {
      const btn = $('.pill', dd);
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = !dd.classList.contains('is-open');
        closeDropdowns();
        dd.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open);
      });
      $('.dropdown__menu', dd).addEventListener('click', (e) => {
        const li = e.target.closest('li[data-value]');
        if (!li) return;
        if (dd.dataset.dropdown === 'currency') setCurrency(li.dataset.value);
        else setLang(li.dataset.value);
        closeDropdowns();
      });
    });
    document.addEventListener('click', closeDropdowns);
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      closeDropdowns();
      $$('.modal.is-open').forEach(hideModal);
    });
  }
  function closeDropdowns() {
    $$('.dropdown.is-open').forEach((dd) => {
      dd.classList.remove('is-open');
      $('.pill', dd).setAttribute('aria-expanded', 'false');
    });
  }

  function setLang(lang) {
    state.lang = lang;
    initDatePickers();
    store.set('cp.lang', lang);
    // keep ?lang= in the address bar in sync, otherwise a reload would switch back
    const url = new URL(location.href);
    if (url.searchParams.has('lang')) { url.searchParams.set('lang', lang); history.replaceState(null, '', url); }
    renderAll();
  }
  function setCurrency(code) {
    state.currency = code;
    store.set('cp.currency', code);
    renderAll();
  }

  /* ---------- Hero slider ---------- */
  const SLIDES = ALL_CARS;
  let autoplay;

  function buildHeroStage() {
    $('#heroStage').innerHTML = SLIDES.map((car, i) => car.photo
      ? `<div class="slide slide--photo${i === 0 ? ' is-active' : ''}"><img src="${car.img}" alt="${escapeHtml(car.name)}" fetchpriority="high"></div>`
      : `<div class="slide slide--cut${car.glow ? ' slide--glow' : ''}"><img src="${car.img}" alt="${escapeHtml(car.name)}" loading="lazy"></div>`
    ).join('');
    $('#heroDots').innerHTML = SLIDES.map((car, i) =>
      `<button type="button" aria-label="${escapeHtml(car.name)}" data-i="${i}"></button>`).join('');
  }

  function renderHero() {
    const car = SLIDES[state.slide];
    $$('#heroStage .slide').forEach((s, i) => s.classList.toggle('is-active', i === state.slide));
    $$('#heroDots button').forEach((b, i) => b.classList.toggle('is-active', i === state.slide));
    $('#heroName').textContent = car.name;
    $('#heroFrom').textContent = t('hero.from', { price: price(car.price) });
    $('#heroDesc').textContent = car.desc[state.lang];
    $('#heroSpecs').innerHTML = [
      [car.engine, t('spec.engine')],
      [car.hp, t('spec.power')],
      [`${num(car.accel)} ${t('unit.sec')}`, t('spec.accel')],
      [`${car.top} ${t('unit.kmh')}`, t('spec.top')]
    ].map(([v, l]) => `<div><dt>${escapeHtml(v)}</dt><dd>${escapeHtml(l)}</dd></div>`).join('');
    $('#heroRent').dataset.car = car.id;
  }

  function goSlide(i, user) {
    state.slide = (i + SLIDES.length) % SLIDES.length;
    const card = $('.showcase__card');
    card.classList.remove('is-swapping');
    void card.offsetWidth;
    card.classList.add('is-swapping');
    renderHero();
    if (user) restartAutoplay();
  }
  function restartAutoplay() {
    clearInterval(autoplay);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    autoplay = setInterval(() => goSlide(state.slide + 1), 7000);
  }

  function initHero() {
    buildHeroStage();
    $('#heroPrev').addEventListener('click', () => goSlide(state.slide - 1, true));
    $('#heroNext').addEventListener('click', () => goSlide(state.slide + 1, true));
    $('#heroDots').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-i]');
      if (b) goSlide(+b.dataset.i, true);
    });
    $('#heroRent').addEventListener('click', () => selectCarInForm($('#heroRent').dataset.car));

    let x0 = null;
    const stage = $('.showcase');
    stage.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) goSlide(state.slide + (dx < 0 ? 1 : -1), true);
      x0 = null;
    });
    restartAutoplay();
  }

  /* ---------- Brands marquee ---------- */
  function initBrands() {
    const item = (b) => `
      <button class="brand" type="button" data-brand="${b.name}">
        <span class="brand__icon" style="--icon:url('${ICON_CDN}${b.icon}.svg')"></span>
        <span class="brand__name">${b.name}</span>
      </button>`;
    const set = BRANDS.map(item).join('');
    // Two identical halves → seamless loop with translateX(-50%)
    $('#brandTrack').innerHTML = set + set + set + set;
    $('#brandTrack').addEventListener('click', (e) => {
      const b = e.target.closest('[data-brand]');
      if (!b) return;
      const brand = b.dataset.brand;
      state.brand = CARS.some((c) => c.brand === brand) ? brand : 'all';
      state.expanded = true;
      renderCatalog();
      if (brand === 'Mercedes') goSlide(0, true);
      $('#catalog').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- Catalog ---------- */
  function renderBrandFilter() {
    const brands = [...new Set(CARS.map((c) => c.brand))];
    $('#brandFilter').innerHTML = `<option value="all">${t('cat.allBrands')}</option>` +
      brands.map((b) => `<option value="${b}">${b}</option>`).join('');
    $('#brandFilter').value = state.brand;
    $('#carSort').value = state.sort;
  }

  function filteredCars() {
    const q = state.query.trim().toLowerCase();
    let list = CARS.filter((c) =>
      (state.brand === 'all' || c.brand === state.brand) &&
      (!q || `${c.name} ${c.brand} ${c.engine}`.toLowerCase().includes(q)));
    if (state.sort === 'priceAsc') list = [...list].sort((a, b) => a.price - b.price);
    if (state.sort === 'priceDesc') list = [...list].sort((a, b) => b.price - a.price);
    if (state.sort === 'power') list = [...list].sort((a, b) => b.hp - a.hp);
    return list;
  }

  function carCard(car) {
    return `
      <article class="car${car.glow ? ' car--glow' : ''}">
        <div class="car__img"><img src="${car.img}" alt="${escapeHtml(car.name)}" loading="lazy"></div>
        <h3 class="car__name">${escapeHtml(car.name)}</h3>
        <ul class="car__meta">
          <li>${t('card.year', { v: car.year })}</li>
          <li>${t('card.accel', { v: num(car.accel) })}</li>
          <li>${t('card.hp', { v: car.hp })}</li>
          <li>${t('card.seats', { v: car.seats })}</li>
        </ul>
        ${priceRow(car)}
        <div class="car__actions">
          <button class="btn btn--light car__more" type="button" data-details="${car.id}">${t('cat.details')}</button>
          <a class="icon-btn" href="${waLink(t('wa.car', { car: car.name }))}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="ico ico--wa"></i></a>
          <a class="icon-btn" href="https://t.me/${CONTACTS.telegram}" target="_blank" rel="noopener" aria-label="Telegram"><i class="ico ico--tg"></i></a>
        </div>
      </article>`;
  }

  function renderCatalog() {
    renderBrandFilter();
    const list = filteredCars();
    const filtering = state.query || state.brand !== 'all';
    const shown = state.expanded || filtering ? list : list.slice(0, CATALOG_INITIAL);
    $('#carGrid').innerHTML = shown.map(carCard).join('');
    $('#carEmpty').hidden = list.length > 0;
    const more = $('#carMore');
    more.hidden = filtering || list.length <= CATALOG_INITIAL;
    more.textContent = state.expanded ? t('cat.less') : t('cat.more');
  }

  function initCatalog() {
    $('#brandFilter').addEventListener('change', (e) => { state.brand = e.target.value; renderCatalog(); });
    $('#carSort').addEventListener('change', (e) => { state.sort = e.target.value; renderCatalog(); });
    $('#carSearch').addEventListener('input', (e) => { state.query = e.target.value; renderCatalog(); });
    $('#carMore').addEventListener('click', () => {
      state.expanded = !state.expanded;
      renderCatalog();
      if (!state.expanded) $('#catalog').scrollIntoView({ behavior: 'smooth' });
    });
    $('#carGrid').addEventListener('click', (e) => {
      const b = e.target.closest('[data-details]');
      if (b) openModal(b.dataset.details);
    });
  }

  /* ---------- Modal ---------- */
  let lastFocus = null;
  let modalCar = null;

  function renderModal() {
    const car = ALL_CARS.find((c) => c.id === modalCar);
    if (!car) return;
    const rows = [
      [t('spec.year'), car.year],
      [t('spec.engine'), car.engine],
      [t('spec.power'), car.hp],
      [t('spec.accel'), `${num(car.accel)} ${t('unit.sec')}`],
      [t('spec.top'), `${car.top} ${t('unit.kmh')}`],
      [t('spec.seats'), car.seats],
      [t('spec.gearbox'), t('val.auto')],
      [t('spec.drive'), t('val.awd')],
      [t('spec.fuel'), t(car.fuel === 'hybrid' ? 'val.hybrid' : 'val.petrol')]
    ];
    $('#modalBody').innerHTML = `
      <div class="modal__img${car.photo ? ' modal__img--photo' : ''}"><img src="${car.img}" alt="${escapeHtml(car.name)}"></div>
      <div class="modal__content">
        <h3 id="modalTitle">${escapeHtml(car.name)}</h3>
        <p class="modal__desc">${escapeHtml(car.desc[state.lang])}</p>
        <h4>${t('modal.specs')}</h4>
        <dl class="modal__specs">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${escapeHtml(v)}</dd></div>`).join('')}</dl>
        <h4>${t('modal.prices')}</h4>
        ${priceRow(car, ' car__prices--modal')}
        <div class="modal__actions">
          <a href="#contacts" class="btn btn--glow" data-book="${car.id}">${t('modal.book')}</a>
          <a class="icon-btn icon-btn--dark" href="${waLink(t('wa.car', { car: car.name }))}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="ico ico--wa"></i></a>
        </div>
      </div>`;
  }

  // Shared show/hide for all dialogs (car details, account, legal)
  function showModal(m) {
    lastFocus = document.activeElement;
    m.hidden = false;
    requestAnimationFrame(() => m.classList.add('is-open'));
    document.body.classList.add('no-scroll');
    $('.modal__close', m).focus();
  }
  function hideModal(m) {
    if (m.hidden) return;
    m.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { m.hidden = true; }, 250);
    if (m.id === 'carModal') modalCar = null;
    if (m.id === 'legalModal') legalOpen = null;
    if (lastFocus) lastFocus.focus();
  }
  function openModal(id) {
    modalCar = id;
    renderModal();
    showModal($('#carModal'));
  }
  function initModal() {
    $$('.modal').forEach((m) => m.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) hideModal(m);
    }));
    $('#carModal').addEventListener('click', (e) => {
      const book = e.target.closest('[data-book]');
      if (book) { selectCarInForm(book.dataset.book); hideModal($('#carModal')); }
    });
  }

  /* ---------- Legal (terms / privacy / cookies) ---------- */
  let legalOpen = null;
  const LEGAL = {
    terms: ['faq.a1', 'faq.a2', 'faq.a4', 'legal.terms.4'],
    privacy: ['legal.privacy.1', 'legal.privacy.2', 'legal.privacy.3'],
    cookies: ['legal.cookies.1', 'legal.cookies.2']
  };
  function renderLegal() {
    if (!legalOpen) return;
    $('#legalBody').innerHTML = `
      <h3 id="legalTitle">${t(`legal.${legalOpen}.t`)}</h3>
      <ul class="checks">${LEGAL[legalOpen].map((k) => `<li>${t(k)}</li>`).join('')}</ul>`;
  }
  function initLegal() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-legal]');
      if (!a) return;
      e.preventDefault();
      legalOpen = a.dataset.legal;
      renderLegal();
      showModal($('#legalModal'));
    });
  }

  /* ---------- "Coming soon" dialog for the backup driver service ---------- */
  function initSoon() {
    const modal = $('#soonModal');
    const form = $('#soonForm');
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-soon]');
      if (!a) return;
      e.preventDefault();
      form.hidden = false;
      $('#soonDone').hidden = true;
      $('#soonError').hidden = true;
      showModal(modal);
      form.elements.namedItem('email').focus();
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.elements.namedItem('email').value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      $('#soonError').hidden = ok;
      if (!ok) return;
      if (NOTIFY_ENDPOINT) {
        try {
          await fetch(NOTIFY_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ email, service: 'backup-driver', lang: state.lang })
          });
        } catch { /* still show the confirmation; the request can be retried by the visitor */ }
      } else {
        // No mailing service connected yet: hand the address over via WhatsApp
        window.open(waLink(t('wa.notify', { email })), '_blank', 'noopener');
      }
      form.reset();
      form.hidden = true;
      $('#soonDone').hidden = false;
    });
  }

  /* ---------- Footer shortcuts: full fleet / deluxe ---------- */
  function initShortcuts() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-go]');
      if (!a) return;
      state.brand = 'all';
      state.query = '';
      $('#carSearch').value = '';
      state.expanded = true;
      state.sort = a.dataset.go === 'deluxe' ? 'priceDesc' : 'default';
      renderCatalog();
    });
  }

  /* ---------- Personal account (Google sign-in, data kept in this browser) ---------- */
  const account = {
    get user() { try { return JSON.parse(store.get('cp.user')); } catch { return null; } },
    set user(u) { store.set('cp.user', u ? JSON.stringify(u) : ''); },
    get requests() { try { return JSON.parse(store.get('cp.requests')) || []; } catch { return []; } },
    addRequest(r) { store.set('cp.requests', JSON.stringify([r, ...this.requests].slice(0, 20))); }
  };
  let gisLoading = null;

  function loadGoogle() {
    if (!GOOGLE_CLIENT_ID) return Promise.reject(new Error('GOOGLE_CLIENT_ID is not set'));
    if (window.google?.accounts?.id) return Promise.resolve();
    gisLoading ??= new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.onload = () => {
        google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: onGoogleCredential });
        resolve();
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return gisLoading;
  }
  // The ID token is only decoded for display (name, email, photo); it is not verified on a server.
  function onGoogleCredential(resp) {
    const part = resp.credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(part).split('').map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''));
    const p = JSON.parse(json);
    account.user = { name: p.given_name || p.name, email: p.email, picture: p.picture };
    renderAccount();
    renderAccountButton();
    prefillForm();
  }

  function renderAccountButton() {
    const u = account.user;
    const btn = $('#accountBtn');
    const img = $('img', btn);
    img.hidden = !u?.picture;
    if (u?.picture) img.src = u.picture;
    btn.classList.toggle('is-signed', !!u);
  }

  function renderAccount() {
    const body = $('#accountBody');
    const u = account.user;
    if (!u) {
      body.innerHTML = `
        <h3 id="accTitle">${t('acc.title')}</h3>
        <p class="account__intro">${t('acc.intro')}</p>
        <div class="account__google" id="googleBtn"></div>
        <p class="account__note" id="accNote" hidden>${t('acc.soon')}</p>
        <p class="account__small">${t('acc.privacy')}</p>`;
      loadGoogle()
        .then(() => google.accounts.id.renderButton($('#googleBtn'), {
          theme: 'filled_black', size: 'large', shape: 'pill', text: 'continue_with', width: 300, locale: state.lang
        }))
        .catch(() => {
          $('#googleBtn').innerHTML = `
            <button class="btn btn--light btn--block google-btn" type="button" id="googleFallback">
              <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
              <span>Google</span>
            </button>`;
          $('#googleFallback').addEventListener('click', () => { $('#accNote').hidden = false; });
        });
      return;
    }
    const reqs = account.requests;
    const fmt = fmtDate;
    body.innerHTML = `
      <div class="account__head">
        ${u.picture ? `<img class="account__avatar" src="${escapeHtml(u.picture)}" alt="" referrerpolicy="no-referrer">` : '<span class="account__avatar"></span>'}
        <div>
          <h3 id="accTitle">${escapeHtml(t('acc.hello', { name: u.name }))}</h3>
          <p>${escapeHtml(u.email)}</p>
        </div>
      </div>
      <div class="account__tier">
        <div>
          <small>${t('acc.level')}</small>
          <b>Silver · 5%</b>
        </div>
        <p>${t('acc.levelNote')}</p>
      </div>
      <h4>${t('acc.requests')}</h4>
      ${reqs.length ? `<ul class="account__list">${reqs.map((r) => `
        <li>
          <b>${escapeHtml(r.car)}</b>
          <span>${fmt(r.from)} — ${fmt(r.to)}</span>
          <em>${t('acc.sent')}</em>
        </li>`).join('')}</ul>` : `<p class="account__empty">${t('acc.empty')}</p>`}
      <div class="account__actions">
        <a href="#contacts" class="btn btn--glow" data-close>${t('acc.book')}</a>
        <button class="btn btn--ghost" type="button" id="accLogout">${t('acc.logout')}</button>
      </div>`;
    $('#accLogout').addEventListener('click', () => {
      account.user = null;
      if (window.google?.accounts?.id) google.accounts.id.disableAutoSelect();
      renderAccount();
      renderAccountButton();
    });
  }

  function initAccount() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-account]');
      if (!a) return;
      e.preventDefault();
      document.body.classList.remove('menu-open');
      renderAccount();
      showModal($('#accountModal'));
    });
    renderAccountButton();
  }
  function prefillForm() {
    const u = account.user;
    const name = $('#bookForm').elements.namedItem('name');
    if (u && !name.value) name.value = u.name;
  }

  /* ---------- FAQ ---------- */
  function renderFaq() {
    const open = $$('#faqList .faq__item.is-open').map((el) => el.dataset.i);
    $('#faqList').innerHTML = [1, 2, 3, 4, 5].map((i) => `
      <div class="faq__item${open.includes(String(i)) ? ' is-open' : ''}" data-i="${i}">
        <button class="faq__q" type="button" aria-expanded="${open.includes(String(i))}">
          <span>${t(`faq.q${i}`)}</span><i aria-hidden="true"></i>
        </button>
        <div class="faq__a"><div><p>${t(`faq.a${i}`)}</p></div></div>
      </div>`).join('');
  }
  function initFaq() {
    $('#faqList').addEventListener('click', (e) => {
      const q = e.target.closest('.faq__q');
      if (!q) return;
      const item = q.parentElement;
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      q.setAttribute('aria-expanded', open);
    });
  }

  /* ---------- Booking form ---------- */
  function renderFormCars() {
    const sel = $('#formCar');
    const current = sel.value;
    sel.innerHTML = `<option value="">${t('f.chooseCar')}</option>` +
      ALL_CARS.map((c) => `<option value="${c.id}">${escapeHtml(c.name)} — ${t('hero.from', { price: price(c.price) })}</option>`).join('');
    sel.value = current;
  }
  function selectCarInForm(id) {
    $('#formCar').value = id;
  }
  /* Large calendar (flatpickr); re-created on language change so month names follow the site language */
  const pickers = {};
  function initDatePickers() {
    if (!window.flatpickr) return;   // CDN unavailable: inputs stay plain text fields
    const form = $('#bookForm');
    const keep = { from: form.elements.namedItem('from').value, to: form.elements.namedItem('to').value };
    Object.values(pickers).forEach((p) => p.destroy());
    const locale = state.lang === 'en' ? 'default' : flatpickr.l10ns[state.lang];
    const base = {
      locale,
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: 'd.m.Y',
      minDate: 'today',
      disableMobile: true,
      monthSelectorType: 'static',
      onReady: (_, __, fp) => {
        fp.calendarContainer.classList.add('cp-calendar');
        fp.altInput.placeholder = '—';
      }
    };
    pickers.from = flatpickr('#dateFrom', {
      ...base,
      defaultDate: keep.from || null,
      onChange: ([d]) => {
        if (!d) return;
        pickers.to.set('minDate', d);
        if (!pickers.to.selectedDates[0] || pickers.to.selectedDates[0] < d) pickers.to.setDate(d);
        pickers.to.open();
      }
    });
    pickers.to = flatpickr('#dateTo', { ...base, defaultDate: keep.to || null, minDate: keep.from || 'today' });
  }

  function initForm() {
    const form = $('#bookForm');
    initDatePickers();
    prefillForm();
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form));
      const ok = d.name.trim() && d.phone.trim() && d.from && d.to;
      $('#formError').hidden = !!ok;
      if (!ok) return;
      const car = ALL_CARS.find((c) => c.id === d.car);
      const fmt = fmtDate;
      let msg = t('wa.book', { car: car ? car.name : '—', from: fmt(d.from), to: fmt(d.to), name: d.name.trim(), phone: d.phone.trim() });
      if (d.comment.trim()) msg += `\n${t('wa.comment', { v: d.comment.trim() })}`;
      if (account.user) account.addRequest({ car: car ? car.name : '—', from: d.from, to: d.to });
      window.open(waLink(msg), '_blank', 'noopener');
    });
  }

  /* ---------- Header / menu ---------- */
  function initHeader() {
    const header = $('#header');
    const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 20);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });

    const burger = $('#burger');
    burger.addEventListener('click', () => {
      const open = !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open);
    });
    $$('#nav a, .header__cta').forEach((a) => a.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- Loyalty card tilt ---------- */
  function initTilt() {
    const card = $('#loyCard');
    if (!card || matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;
    const wrap = card.parentElement;
    wrap.addEventListener('mousemove', (e) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
      card.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
      card.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
    });
    wrap.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Render all ---------- */
  function renderAll() {
    applyI18n();
    renderDropdowns();
    renderHero();
    renderCatalog();
    renderFaq();
    renderFormCars();
    if (modalCar) renderModal();
    renderLegal();
    if (!$('#accountModal').hidden) renderAccount();
    applyLinks();
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('#year').textContent = new Date().getFullYear();
    initDropdowns();
    initHero();
    initBrands();
    initCatalog();
    initModal();
    initFaq();
    initForm();
    initHeader();
    initTilt();
    initLegal();
    initShortcuts();
    initSoon();
    initAccount();
    renderAll();
    initReveal();
    const url = new URL(location.href);
    if (url.searchParams.has('lang')) { store.set('cp.lang', state.lang); }
  });
})();
