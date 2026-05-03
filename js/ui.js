/* ========== UI & RENDER ========== */

// ---- Navigazione pagine ----
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + id);
  if (pg) { pg.classList.add('active'); window.scrollTo(0, 0); }
  if (id === 'admin') {
    const logged = sessionStorage.getItem('adminLogged') === '1';
    document.getElementById('adminLoginView').style.display  = logged ? 'none'  : 'block';
    document.getElementById('adminMainView').style.display   = logged ? 'block' : 'none';
    if (logged) renderAdminAll();
  }
  if (id === 'ordini') {
    if (typeof populateCartSelect === 'function') populateCartSelect();
    if (typeof renderCart === 'function') renderCart();
    if (typeof refreshOrdiniView === 'function') refreshOrdiniView();
  }
  if (id === 'miei-ordini') {
    if (typeof renderMieiOrdiniPage === 'function') renderMieiOrdiniPage();
  }
  renderAll();
}

function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('open');
}

function toggleMobAccordion(btn) {
  const body = btn.nextElementSibling;
  const isOpen = body.classList.contains('open');
  const parent = btn.closest('.mob-accordion').parentElement;
  parent.querySelectorAll(':scope > .mob-accordion > .mob-accordion-btn').forEach(b => {
    b.classList.remove('open');
    b.nextElementSibling.classList.remove('open');
  });
  if (!isOpen) {
    btn.classList.add('open');
    body.classList.add('open');
  }
}

// ---- Toast ----
let toastTimer = null;
function toast(msg, type = '', dur = 3500) {
  const t = document.getElementById('toastEl');
  t.textContent = msg;
  t.className = 'toast show';
  if (type) t.classList.add(type);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = 'toast'; }, dur);
}

// ---- Tabs ----
function switchTab(btn, id) {
  const container = btn.closest('.piscina-tipo') || btn.closest('.container') || document;
  container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  container.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

// ---- Modale ----
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Categorie ordinabili (no piscine)
const ORDERABLE_CATS = new Set(['chimici','zanzare','disinfezione','centraline','elettrolisi','collettori','filtri','idro']);

// ---- Prodotti ----
function makeProductCard(p, catKey) {
  const noteHtml = p.note ? `<div style="font-size:12px;color:var(--verde);font-weight:700;margin-top:4px;display:flex;align-items:center;gap:4px;"><span style="color:var(--verde);">✔</span> ${p.note}</div>` : '';
  const prezzoHtml = (p.prezzo !== undefined && p.prezzo !== null && p.prezzo !== '')
    ? `<div class="product-prezzo">€ ${Number(p.prezzo).toFixed(2).replace('.', ',')}${noteHtml}</div>`
    : '';
  const cartBtn = catKey && ORDERABLE_CATS.has(catKey)
    ? `<button class="btn-add-cart" onclick="addToCartDirect('${p.nome.replace(/'/g,"\\'")}',this)">🛒 Aggiungi al carrello</button>`
    : '';
  const descFormatted = p.desc ? p.desc.replace(/\n/g,'<br>') : '';

  // Hero layout for products with multiple images
  if (p.imgs && p.imgs.length > 1) {
    const uid = 'gal_' + Math.random().toString(36).slice(2,8);
    const thumbs = p.imgs.map((src,i) =>
      `<img src="${src}" alt="${p.nome}" class="${i===0?'active':''}" onclick="galSwitch('${uid}',this,'${src}')">`
    ).join('');
    return `<div class="product-card izanz-hero">
      <div class="product-img has-gallery" id="${uid}">
        <img id="${uid}_main" class="gallery-main" src="${p.imgs[0]}" alt="${p.nome}" onclick="openLightbox(this.src,this.alt)">
        <div class="gallery-thumbs">${thumbs}</div>
      </div>
      <div class="product-body">
        <span class="izanz-badge">🌿 Sistema Automatico Fai-Da-Te</span>
        <h4>${p.nome}</h4>
        <p>${descFormatted}</p>
        <div class="izanz-features">
          <span class="izanz-feat">📏 Copertura 25 mt</span>
          <span class="izanz-feat">⚡ Alta Pressione</span>
          <span class="izanz-feat">🇮🇹 Made in Italy</span>
        </div>
        ${prezzoHtml}${cartBtn}
      </div>
    </div>`;
  }

  // Standard card
  const imgHtml = p.img
    ? `<img src="${p.img}" alt="${p.nome}" style="width:100%;height:200px;object-fit:contain;padding:10px;background:#fff;cursor:zoom-in;" onclick="openLightbox(this.src,this.alt)" onerror="this.parentElement.innerHTML='<div class=\\'img-placeholder\\'><svg viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\' style=\\'width:32px;height:32px;opacity:.5;\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><polyline points=\\'21 15 16 10 5 21\\'/></svg><span>Immagine da inserire</span></div>'">`
    : `<div class="img-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;opacity:.5;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>Immagine da inserire</span></div>`;
  return `<div class="product-card"><div class="product-img">${imgHtml}</div><div class="product-body"><h4>${p.nome}</h4><p>${descFormatted}</p>${prezzoHtml}${cartBtn}</div></div>`;
}

window.galSwitch = function(uid, thumbEl, src) {
  const mainImg = document.getElementById(uid + '_main');
  if (mainImg) {
    mainImg.style.opacity = '0';
    mainImg.style.transition = 'opacity .18s';
    setTimeout(() => { mainImg.src = src; mainImg.style.opacity = '1'; }, 160);
  }
  const container = document.getElementById(uid);
  if (container) {
    container.querySelectorAll('.gallery-thumbs img').forEach(t => t.classList.remove('active'));
  }
  thumbEl.classList.add('active');
};

function renderGrid(id, key) {
  const el = document.getElementById(id);
  if (!el) return;
  const arr = window.data.products[key] || [];
  el.innerHTML = arr.length
    ? arr.map(p => makeProductCard(p, key)).join('')
    : `<p style="color:var(--testo2);font-size:14px;padding:20px 0;">Nessun prodotto. Aggiungine dal pannello Admin.</p>`;
}

function renderAll() {
  renderGrid('idroGrid', 'idro');
  renderGrid('chimiciGrid', 'chimici');
  renderGrid('zanzareGrid', 'zanzare');
  renderGrid('disinfezioneGrid', 'disinfezione');
  renderGrid('centralineGrid', 'centraline');
  renderGrid('elettrolisiGrid', 'elettrolisi');
  renderGrid('impiantiCentralineGrid', 'centraline');
  renderGrid('filtriGrid', 'filtri');
  renderGrid('colletoriGrid', 'collettori');     // per la pagina "Impianti meccanici"
  renderGrid('interrata1Grid', 'interrata1');
  renderGrid('interrata2Grid', 'interrata2');
  renderGrid('interrata3Grid', 'interrata3');
  renderGrid('semi1Grid', 'semi1');
  renderGrid('semi2Grid', 'semi2');
  renderGrid('semi3Grid', 'semi3');
  renderGrid('fuoroTerraGrid', 'fuoroterra');
  renderLavori();
  renderRecensioni();   // aggiorna lo slider delle recensioni
  updateStats();
}

// ---- Lavori ----
function renderLavori() {
  const el = document.getElementById('lavoriGallery');
  if (!el) return;
  el.innerHTML = window.data.lavori.map(l => `
    <div class="gallery-item">
      <div class="img-box">${l.img
        ? `<img src="${l.img}" alt="${l.titolo}" onerror="this.parentElement.innerHTML='<span>📷 Immagine da inserire</span>'">`
        : `<span>📷 Immagine da inserire</span>`}</div>
      <div class="gallery-caption"><h4>${l.titolo}</h4><p>${l.desc}</p></div>
    </div>`).join('') || '<p style="color:var(--testo2);">Nessun lavoro pubblicato.</p>';
}

// ========== SLIDER RECENSIONI ==========
let recensioniSlider = null;
let currentRecIndex = 0;
let recensioniData = [];
let autoplayInterval = null;

function renderRecensioni() {
  const sliderContainer = document.getElementById('recensioniSlider');
  if (!sliderContainer) return;
  
  recensioniData = window.data.recensioni || [];
  if (recensioniData.length === 0) {
    sliderContainer.innerHTML = '<div class="recensione-card">Nessuna recensione disponibile.</div>';
    return;
  }
  
  // Crea la traccia orizzontale
  const track = document.createElement('div');
  track.className = 'slider-track';
  track.style.display = 'flex';
  track.style.transition = 'transform 0.4s ease';
  
  recensioniData.forEach((r, idx) => {
    const card = document.createElement('div');
    card.className = 'recensione-card';
    card.style.flex = '0 0 100%';
    card.innerHTML = `
      <div class="stelle">${'★'.repeat(r.stelle)}${'☆'.repeat(5 - r.stelle)}</div>
      <p>"${r.testo}"</p>
      <div class="autore">– ${r.autore}</div>
    `;
    track.appendChild(card);
  });
  
  sliderContainer.innerHTML = '';
  sliderContainer.appendChild(track);
  
  // Crea i pallini (dots)
  const dotsContainer = document.getElementById('sliderDots');
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    recensioniData.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === currentRecIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }
  
  // Posiziona la slide corrente
  updateSliderPosition();
  
  // Imposta autoplay
  if (autoplayInterval) clearInterval(autoplayInterval);
  autoplayInterval = setInterval(() => {
    nextSlide();
  }, 6000);
}

function updateSliderPosition() {
  const track = document.querySelector('#recensioniSlider .slider-track');
  if (track) {
    track.style.transform = `translateX(-${currentRecIndex * 100}%)`;
  }
  // Aggiorna dots attivi
  document.querySelectorAll('.dot').forEach((dot, i) => {
    if (i === currentRecIndex) dot.classList.add('active');
    else dot.classList.remove('active');
  });
}

function nextSlide() {
  if (!recensioniData.length) return;
  currentRecIndex = (currentRecIndex + 1) % recensioniData.length;
  updateSliderPosition();
}

function prevSlide() {
  if (!recensioniData.length) return;
  currentRecIndex = (currentRecIndex - 1 + recensioniData.length) % recensioniData.length;
  updateSliderPosition();
}

function goToSlide(index) {
  if (!recensioniData.length) return;
  currentRecIndex = Math.min(Math.max(0, index), recensioniData.length - 1);
  updateSliderPosition();
  // Reset autoplay timer
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => nextSlide(), 6000);
  }
}

// ---- Stats ----
function updateStats() {
  const sO = document.getElementById('statOrdini');
  const sN = document.getElementById('statNuovi');
  const sL = document.getElementById('statLavori');
  const sR = document.getElementById('statRecensioni');
  if (sO) sO.textContent = window.data.ordini.length;
  if (sN) sN.textContent = window.data.ordini.filter(o => o.stato === 'nuovo').length;
  if (sL) sL.textContent = window.data.lavori.length;
  if (sR) sR.textContent = window.data.recensioni.length;
}

// ---- Contatti ----
function inviaContatto() {
  const nome = document.getElementById('cont-nome').value.trim();
  const cognome = document.getElementById('cont-cognome').value.trim();
  const email = document.getElementById('cont-email').value.trim();
  const messaggio = document.getElementById('cont-messaggio').value.trim();
  const fb = document.getElementById('contattoFeedback');
  if (!nome || !cognome) { toast('Inserisci nome e cognome', 'error'); return; }
  if (!email || !email.includes('@')) { toast('Inserisci un\'email valida', 'error'); return; }
  if (!messaggio) { toast('Scrivi un messaggio', 'error'); return; }
  fb.style.display = 'block';
  fb.style.background = 'var(--acqua2)';
  fb.style.color = 'var(--azzurro-scuro)';
  fb.innerHTML = '✅ <strong>Messaggio inviato!</strong> Ti risponderemo al più presto via email.';
  ['cont-nome','cont-cognome','cont-email','cont-tel','cont-messaggio'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  toast('Messaggio inviato con successo! ✅', 'success');
}

function goToOrderWithKit(nome) {
  showPage('ordini');
  setTimeout(() => {
    const sel = document.getElementById('cart-prodotto');
    if (sel) {
      for (let i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === nome) { sel.selectedIndex = i; break; }
      }
    }
  }, 100);
}

// ---- Attacca listener per i bottoni dello slider quando il DOM è pronto ----
document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('recPrevBtn');
  const nextBtn = document.getElementById('recNextBtn');
  if (prevBtn) prevBtn.addEventListener('click', () => prevSlide());
  if (nextBtn) nextBtn.addEventListener('click', () => nextSlide());
});

/* ========== SCROLL REVEAL ========== */
function initScrollReveal() {
  const els = document.querySelectorAll('.scroll-reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

/* ========== HEADER SCROLLED STATE ========== */
(function() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
})();

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
});
/* ========== AGGIUNGI AL CARRELLO DIRETTO (senza cambiare pagina) ========== */
function addToCartDirect(nomeProdotto, btnEl) {
  // Usa cert vuoto — l'utente lo completerà nella pagina ordini
  if (!window.cartItems) window.cartItems = [];
  // Evita duplicati: se già presente aumenta qty
  const existing = window.cartItems.find(i => i.prodotto === nomeProdotto);
  if (existing) {
    existing.qty += 1;
  } else {
    window.cartItems.push({ prodotto: nomeProdotto, qty: 1, cert: '' });
  }
  updateCartBubble();
  // Animazione pulsante
  if (btnEl) {
    btnEl.textContent = '✅ Aggiunto!';
    btnEl.classList.add('btn-add-cart--added');
    setTimeout(() => {
      btnEl.textContent = '🛒 Aggiungi al carrello';
      btnEl.classList.remove('btn-add-cart--added');
    }, 1800);
  }
  showCartToast(nomeProdotto);
}

function updateCartBubble() {
  const bubble = document.getElementById('cartBubble');
  if (!bubble) return;
  const total = (window.cartItems || []).reduce((s, i) => s + i.qty, 0);
  const badge = bubble.querySelector('.cart-bubble-badge');
  if (badge) badge.textContent = total;
  bubble.style.display = total > 0 ? 'flex' : 'none';
}

function showCartToast(nome) {
  const t = document.getElementById('cartMiniToast');
  if (!t) return;
  t.querySelector('.cmt-nome').textContent = nome;
  t.classList.add('visible');
  clearTimeout(window._cartToastTimer);
  window._cartToastTimer = setTimeout(() => t.classList.remove('visible'), 2800);
}

/* ========== LIGHTBOX ========== */
function openLightbox(src, alt) {
  const overlay = document.getElementById('lightbox-overlay');
  const img = document.getElementById('lightbox-img');
  if (!overlay || !img) return;
  img.src = src;
  img.alt = alt || '';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
