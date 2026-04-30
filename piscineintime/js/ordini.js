/* ========== ORDINI ========== */

let selectedPayment = null;
let ricevutaBase64  = null;
let ricevutaNome    = null;

// Sorgente di verità: window.cartItems, inizializzato subito e mai sostituito
if (!window.cartItems) window.cartItems = [];

/* Shortcut: sempre fresco, legge window.cartItems al momento della chiamata */
function cart() { return window.cartItems; }

/* ---- Mostra/nascondi gate login ---- */
function refreshOrdiniView() {
  const user = getCurrentUser();
  const gate = document.getElementById('ordineLoginGate');
  const form = document.getElementById('ordineFormWrap');
  if (!gate || !form) return;

  if (!user) {
    gate.style.display = 'block';
    form.style.display = 'none';
  } else {
    gate.style.display = 'none';
    form.style.display = 'block';
    const n = document.getElementById('ord-nome');
    const c = document.getElementById('ord-cognome');
    const e = document.getElementById('ord-email');
    const t = document.getElementById('ord-tel');
    if (n && !n.value) n.value = user.nome    || '';
    if (c && !c.value) c.value = user.cognome || '';
    if (e && !e.value) e.value = user.email   || '';
    if (t && !t.value) t.value = user.tel     || '';
  }
  renderMieiOrdini();
}

/* ---- Storico ordini utente loggato ---- */
function renderMieiOrdini() {
  const wrap  = document.getElementById('mieiOrdiniWrap');
  const list  = document.getElementById('mieiOrdiniList');
  const badge = document.getElementById('mieiOrdiniCount');
  if (!wrap || !list) return;

  const user = getCurrentUser();
  if (!user) { wrap.style.display = 'none'; return; }

  const tutti = (window.data && window.data.ordini) ? window.data.ordini : [];
  const miei  = tutti.filter(o => o.email && o.email.toLowerCase() === user.email.toLowerCase());

  wrap.style.display = 'block';

  if (badge) {
    if (miei.length > 0) {
      badge.style.display = 'inline-block';
      badge.textContent   = miei.length + (miei.length === 1 ? ' ordine' : ' ordini');
    } else {
      badge.style.display = 'none';
    }
  }

  if (miei.length === 0) {
    list.innerHTML = '<div class="storico-empty">📭 Non hai ancora effettuato nessun ordine.</div>';
    return;
  }

  const statoMeta = {
    nuovo:          { label:'Nuovo',          icon:'🟢', cls:'stato-nuovo' },
    in_lavorazione: { label:'In lavorazione', icon:'🟡', cls:'stato-in_lavorazione' },
    completato:     { label:'Completato',     icon:'🔵', cls:'stato-completato' },
    annullato:      { label:'Annullato',      icon:'🔴', cls:'stato-annullato' }
  };

  const pagIcn = { bonifico:'🏦', contanti:'💵', carta:'💳' };

  list.innerHTML = miei.map(o => {
    const stato = o.stato || 'nuovo';
    const meta  = statoMeta[stato] || { label: stato, icon:'⚪', cls:'stato-nuovo' };

    const prodotti = Array.isArray(o.prodotti) && o.prodotti.length
      ? o.prodotti.map(p =>
          '<span class="storico-prodotto-tag">' + p.prodotto + ' <strong>× ' + p.qty + '</strong></span>'
        ).join('')
      : '<span class="storico-prodotto-tag">' + (o.prodotto || '–') + '</span>';

    const pagIcon = pagIcn[o.pagamento] || '💳';

    // Barra di progresso stato
    const step = stato === 'annullato' ? -1
               : stato === 'nuovo'     ?  0
               : stato === 'in_lavorazione' ? 1 : 2;
    const stepsBar = stato !== 'annullato'
      ? '<div class="storico-progress">' +
          ['Ricevuto','In lavorazione','Completato'].map((s, i) =>
            '<div class="sp-step' + (i <= step ? ' sp-done' : '') + '">' +
              '<div class="sp-dot"></div>' +
              '<div class="sp-label">' + s + '</div>' +
            '</div>'
          ).join('<div class="sp-line' + (step > 0 ? ' sp-done' : '') + '"></div>' ) +
        '</div>'
      : '<div class="storico-annullato-bar">⛔ Ordine annullato</div>';

    return '<div class="storico-card">' +

      /* Header */
      '<div class="storico-card-head">' +
        '<div class="storico-card-id">' +
          '<span class="storico-id-label">Ordine</span>' +
          '<span class="storico-id-val">' + o.id + '</span>' +
        '</div>' +
        '<div class="storico-card-meta">' +
          '<span class="storico-data">📅 ' + (o.data || '–') + '</span>' +
          '<span class="stato-pill ' + meta.cls + '">' + meta.icon + ' ' + meta.label + '</span>' +
        '</div>' +
      '</div>' +

      /* Barra progresso */
      stepsBar +

      /* Prodotti */
      '<div class="storico-prodotti">' +
        '<div class="storico-section-label">Prodotti ordinati</div>' +
        '<div class="storico-prodotti-list">' + prodotti + '</div>' +
      '</div>' +

      /* Footer info */
      '<div class="storico-card-foot">' +
        '<span>' + pagIcon + ' Pagamento: <strong>' + (o.pagamento || '–') + '</strong></span>' +
        (o.indirizzo ? '<span>📍 ' + o.indirizzo + (o.citta ? ', ' + o.citta : '') + '</span>' : '') +
        (o.note ? '<span>📝 ' + o.note + '</span>' : '') +
      '</div>' +

    '</div>';
  }).join('');
}

/* ---- Popola select prodotti ---- */
function populateCartSelect() {
  const sel = document.getElementById('cart-prodotto');
  if (!sel) return;

  const categoryLabels = {
    chimici:'Prodotti Chimici', zanzare:'Ramo Antizanzare', disinfezione:'Disinfezione',
    centraline:'Centraline', elettrolisi:'Elettrolisi Salina', collettori:'Collettori',
    filtri:'Filtri'
  };

  sel.innerHTML = '<option value="">– Seleziona prodotto –</option>';
  const products = (window.data && window.data.products) ? window.data.products : {};

  Object.keys(categoryLabels).forEach(cat => {
    const arr = products[cat];
    if (!Array.isArray(arr) || arr.length === 0) return;
    const prodCat = arr.filter(p => p.nome);
    if (!prodCat.length) return;
    const grp = document.createElement('optgroup');
    grp.label = categoryLabels[cat];
    prodCat.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.nome;
      const pr = (p.prezzo != null && p.prezzo !== '') ? ' – € ' + Number(p.prezzo).toFixed(2).replace('.', ',') : '';
      opt.textContent = p.nome + pr;
      grp.appendChild(opt);
    });
    sel.appendChild(grp);
  });

  const grpAltro = document.createElement('optgroup');
  grpAltro.label = 'Altro';
  const optAltro = document.createElement('option');
  optAltro.value = 'Altro (specifica nelle note)';
  optAltro.textContent = 'Altro (specifica nelle note)';
  grpAltro.appendChild(optAltro);
  sel.appendChild(grpAltro);
}

/* ---- Aggiungi al carrello dal select interno ---- */
function addToCart() {
  const prodotto = document.getElementById('cart-prodotto').value;
  const qty      = parseInt(document.getElementById('cart-qty').value) || 1;
  if (!prodotto) { toast('Seleziona un prodotto', 'error'); return; }

  const existing = cart().find(i => i.prodotto === prodotto);
  if (existing) { existing.qty += qty; } else { cart().push({ prodotto, qty }); }

  document.getElementById('cart-prodotto').value = '';
  document.getElementById('cart-qty').value = '1';
  renderCart();
  if (typeof updateCartBubble === 'function') updateCartBubble();
  toast('Prodotto aggiunto ✅', 'success');
}

function removeFromCart(index) {
  cart().splice(index, 1);
  renderCart();
  if (typeof updateCartBubble === 'function') updateCartBubble();
}

/* ---- Render carrello ---- */
function renderCart() {
  const el = document.getElementById('cartItemsList');
  if (!el) return;

  const items = cart();

  if (items.length === 0) {
    el.innerHTML = '<div style="border:2px dashed var(--acqua3,#b0d8e8);border-radius:12px;padding:32px 20px;text-align:center;color:var(--testo2);font-size:14px;">🛒 Il carrello è vuoto.<br><span style="font-size:13px;margin-top:6px;display:block;">Sfoglia i prodotti e clicca <strong>"Aggiungi al carrello"</strong> per iniziare.</span></div>';
    const totBox = document.getElementById('cartTotaleBox');
    if (totBox) totBox.style.display = 'none';
    return;
  }

  let totale = 0;
  const allProds = Object.values(window.data.products).flat();

  const rows = items.map((item, i) => {
    const found = allProds.find(p => p.nome === item.prodotto);
    const prezzoUnit = (found && found.prezzo != null) ? Number(found.prezzo) : null;
    const prezzoTot  = prezzoUnit !== null ? prezzoUnit * item.qty : null;
    if (prezzoTot !== null) totale += prezzoTot;

    const unitStr = prezzoUnit !== null ? '<span style="color:var(--testo2);">€ ' + prezzoUnit.toFixed(2).replace('.',',') + ' cad.</span>' : '';
    const totStr  = prezzoTot  !== null ? '<strong style="color:var(--azzurro-scuro);">→ € ' + prezzoTot.toFixed(2).replace('.',',') + '</strong>' : '';

    return '<div class="cart-row-item">' +
      '<div class="cart-row-info">' +
        '<strong>' + item.prodotto + '</strong>' +
        '<div class="cart-row-meta">' +
          '<span>Qty: <strong>' + item.qty + '</strong></span>' +
          (unitStr ? '<span>' + unitStr + '</span>' : '') +
          (totStr  ? '<span>' + totStr  + '</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="cart-row-actions">' +
        '<button onclick="changeQty(' + i + ',-1)" class="qty-btn">−</button>' +
        '<span class="qty-val">' + item.qty + '</span>' +
        '<button onclick="changeQty(' + i + ',+1)" class="qty-btn">+</button>' +
        '<button onclick="removeFromCart(' + i + ')" class="remove-btn">✕</button>' +
      '</div>' +
    '</div>';
  }).join('');

  el.innerHTML = rows;

  const totBox = document.getElementById('cartTotaleBox');
  const totVal = document.getElementById('cartTotaleValore');
  if (totBox) totBox.style.display = totale > 0 ? 'flex' : 'none';
  if (totVal) totVal.textContent = '€ ' + totale.toFixed(2).replace('.',',');
}

function changeQty(index, delta) {
  cart()[index].qty = Math.max(1, cart()[index].qty + delta);
  renderCart();
  if (typeof updateCartBubble === 'function') updateCartBubble();
}

/* ---- Pagamento ---- */
function selectPayment(type) {
  selectedPayment = type;
  document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
  document.querySelectorAll('input[name=pagamento]').forEach(r => { r.checked = r.value === type; });
  const el = document.getElementById('pm-' + type);
  if (el) el.classList.add('selected');
  document.querySelectorAll('.payment-details').forEach(d => d.classList.remove('visible'));
  const detail = document.getElementById('detail-' + type);
  if (detail) detail.classList.add('visible');
  const ibanBox = document.querySelector('.iban-box');
  if (ibanBox && window.data.settings.iban) ibanBox.textContent = window.data.settings.iban;
}

function handleFileUpload(input) {
  const file = input.files[0];
  if (!file) return;
  ricevutaNome = file.name;
  const reader = new FileReader();
  reader.onload = function(e) {
    ricevutaBase64 = e.target.result;
    const area = document.getElementById('uploadArea');
    if (area) area.classList.add('has-file');
    const fn = document.getElementById('fileName');
    if (fn) { fn.textContent = '✅ ' + file.name; fn.style.display = 'block'; }
  };
  reader.readAsDataURL(file);
}

/* ---- Invia ordine ---- */
function submitOrder() {
  const user = getCurrentUser();
  if (!user) { toast('Devi essere loggato per inviare un ordine', 'error'); openUserLogin(); return; }

  const nome      = document.getElementById('ord-nome').value.trim();
  const cognome   = document.getElementById('ord-cognome').value.trim();
  const email     = document.getElementById('ord-email').value.trim();
  const tel       = document.getElementById('ord-tel').value.trim();
  const indirizzo = document.getElementById('ord-indirizzo').value.trim();
  const citta     = document.getElementById('ord-citta').value.trim();
  const cert      = document.getElementById('ord-cert-globale').value.trim();

  if (!nome)                          { toast('Inserisci il nome', 'error'); return; }
  if (!cognome)                       { toast('Inserisci il cognome', 'error'); return; }
  if (!email || !email.includes('@')) { toast("Inserisci un'email valida", 'error'); return; }
  if (!tel)                           { toast('Inserisci il numero di telefono', 'error'); return; }
  if (!indirizzo)                     { toast("Inserisci l'indirizzo", 'error'); return; }
  if (!citta)                         { toast('Inserisci la città', 'error'); return; }
  if (cart().length === 0)            { toast('Il carrello è vuoto', 'error'); return; }
  if (!selectedPayment)               { toast('Seleziona un metodo di pagamento', 'error'); return; }
  if (selectedPayment === 'bonifico' && !ricevutaBase64) {
    toast('Carica la ricevuta del bonifico per procedere', 'error'); return;
  }

  const ordineId = 'ORD-' + Date.now();
  const ordine = {
    id:           ordineId,
    cliente:      nome + ' ' + cognome,
    email, tel, indirizzo, citta,
    prodotti:     JSON.parse(JSON.stringify(cart())),
    prodotto:     cart().map(p => p.prodotto + ' (x' + p.qty + ')').join(', '),
    qty:          cart().reduce((s, p) => s + p.qty, 0),
    cert,
    pagamento:    selectedPayment,
    note:         document.getElementById('ord-note').value,
    data:         new Date().toLocaleDateString('it-IT'),
    dataISO:      new Date().toISOString(),
    stato:        'nuovo',
    ricevuta:     ricevutaBase64 || null,
    ricevutaNome: ricevutaNome   || null
  };

  window.data.ordini.unshift(ordine);
  saveDB();
  if (typeof updateStats === 'function') updateStats();

  // Svuota carrello in-place (non sostituire l'array!)
  window.cartItems.length = 0;
  if (typeof updateCartBubble === 'function') updateCartBubble();

  document.getElementById('ordineFormWrap').style.display = 'none';
  document.getElementById('ordineSuccess').classList.add('visible');
  document.getElementById('ordineNumDisplay').textContent = ordineId;

  toast('✅ Ordine inviato con successo!', 'success');
  renderMieiOrdini();
}

/* ---- Reset ---- */
function nuovoOrdine() {
  ['ord-nome','ord-cognome','ord-email','ord-tel','ord-indirizzo','ord-citta','ord-note','ord-cert-globale']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

  window.cartItems.length = 0;
  renderCart();
  populateCartSelect();
  if (typeof updateCartBubble === 'function') updateCartBubble();

  selectedPayment = null;
  ricevutaBase64  = null;
  ricevutaNome    = null;

  document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
  document.querySelectorAll('.payment-details').forEach(d => d.classList.remove('visible'));

  const area = document.getElementById('uploadArea');
  if (area) area.classList.remove('has-file');
  const fn = document.getElementById('fileName');
  if (fn) fn.style.display = 'none';
  const ri = document.getElementById('ricevutaInput');
  if (ri) ri.value = '';

  document.getElementById('ordineFormWrap').style.display = 'block';
  document.getElementById('ordineSuccess').classList.remove('visible');
  window.scrollTo(0, 0);
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', function() {
  // window.cartItems già pronto (inizializzato in cima al file).
  // Tutte le funzioni chiamano cart() che legge window.cartItems direttamente.
  populateCartSelect();
  renderCart();
  refreshOrdiniView();
  if (typeof updateCartBubble === 'function') updateCartBubble();
});
