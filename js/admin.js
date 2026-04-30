/* ========== ADMIN ========== */

let adminFiltro = 'tutti';

// ---- Login / Logout ----
function adminLogin() {
  const u      = document.getElementById('adminUser').value.trim();
  const p      = document.getElementById('adminPass').value;
  const errEl  = document.getElementById('loginErr');
  const cfg    = window.data.settings;

  if (u === cfg.adminUser && p === cfg.adminPass) {
    sessionStorage.setItem('adminLogged', '1');
    errEl.style.display = 'none';
    document.getElementById('adminLoginView').style.display = 'none';
    document.getElementById('adminMainView').style.display  = 'block';
    renderAdminAll();
  } else {
    errEl.style.display = 'block';
    document.getElementById('adminPass').value = '';
  }
}

function adminLogout() {
  sessionStorage.removeItem('adminLogged');
  document.getElementById('adminLoginView').style.display = 'block';
  document.getElementById('adminMainView').style.display  = 'none';
  document.getElementById('adminUser').value = '';
  document.getElementById('adminPass').value = '';
}

// ---- Sezione sidebar ----
function adminSection(el, id) {
  document.querySelectorAll('.admin-menu-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
  const sec = document.getElementById('admin-' + id);
  if (sec) sec.style.display = 'block';
}

function renderAdminAll() {
  renderAdminOrdini();
  renderAdminProdotti();
  renderAdminLavori();
  renderAdminRecensioni();
  updateStats();
  loadSettingsForm();
}

// ---- ORDINI ----
function filtraOrdini(stato, btn) {
  adminFiltro = stato;
  document.querySelectorAll('#admin-ordini .tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderAdminOrdini();
}

/* Restituisce HTML per il dettaglio prodotti nel modale */
function renderProdottiDetail(o) {
  if (o.prodotti && o.prodotti.length > 0) {
    return o.prodotti.map(p =>
      `<div style="margin-bottom:4px;"><strong>${p.prodotto}</strong> — Qta: ${p.qty} — Cert: ${p.cert}</div>`
    ).join('');
  }
  return `${o.prodotto || '–'} (x${o.qty || 1})`;
}


function renderProdottiCell(o) {
  if (o.prodotti && o.prodotti.length > 0) {
    if (o.prodotti.length === 1) {
      return `${o.prodotti[0].prodotto}<br><small style="color:var(--testo2);">x${o.prodotti[0].qty} | cert: ${o.prodotti[0].cert}</small>`;
    }
    const lista = o.prodotti.map(p =>
      `<div style="font-size:12px;"><strong>${p.prodotto}</strong> x${p.qty} <span style="color:var(--testo2);">(cert: ${p.cert})</span></div>`
    ).join('');
    return `<strong style="font-size:12px;">${o.prodotti.length} prodotti</strong>${lista}`;
  }
  // Compatibilità con ordini vecchi (singolo prodotto)
  return `${o.prodotto || '–'}<br><small style="color:var(--testo2);">x${o.qty || 1} | cert: ${o.cert || '–'}</small>`;
}

function renderAdminOrdini() {
  const tb = document.getElementById('ordiniTableBody');
  if (!tb) return;
  let ordini = window.data.ordini;
  if (adminFiltro !== 'tutti') ordini = ordini.filter(o => o.stato === adminFiltro);
  if (!ordini.length) {
    tb.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--testo2);padding:24px;">Nessun ordine</td></tr>`;
    return;
  }
  tb.innerHTML = ordini.map(o => {
    const realIdx  = window.data.ordini.indexOf(o);
    const pagIcon  = o.pagamento === 'bonifico' ? '🏦' : o.pagamento === 'assegno' ? '📄' : '🏪';
    const ricBtn   = o.ricevuta ? `<button class="btn-warning" onclick="viewRicevuta(${realIdx})" title="Vedi ricevuta">📎</button>` : '';
    return `<tr>
      <td><small style="color:var(--testo2);font-size:11px;">${o.id}</small></td>
      <td><strong>${o.cliente}</strong><br><small style="color:var(--testo2);">${o.email}</small><br><small>${o.tel || ''}</small></td>
      <td>${renderProdottiCell(o)}</td>
      <td>${pagIcon} ${o.pagamento}</td>
      <td>${o.data}</td>
      <td>
        <select class="stato-select" onchange="changeOrdineStato(${realIdx},this.value)">
          <option value="nuovo"         ${o.stato === 'nuovo'          ? 'selected' : ''}>🟢 Nuovo</option>
          <option value="in_lavorazione"${o.stato === 'in_lavorazione' ? 'selected' : ''}>🟡 In lavorazione</option>
          <option value="completato"    ${o.stato === 'completato'     ? 'selected' : ''}>🔵 Completato</option>
          <option value="annullato"     ${o.stato === 'annullato'      ? 'selected' : ''}>🔴 Annullato</option>
        </select>
      </td>
      <td style="display:flex;gap:6px;flex-wrap:wrap;">
        <button class="btn-success" onclick="viewOrdine(${realIdx})" title="Dettaglio">🔍</button>
        ${ricBtn}
        <button class="btn-danger"  onclick="deleteOrdine(${realIdx})" title="Elimina">✕</button>
      </td>
    </tr>`;
  }).join('');
}

function changeOrdineStato(i, stato) {
  window.data.ordini[i].stato = stato;
  saveDB();
  renderAdminOrdini();
  updateStats();
}

function deleteOrdine(i) {
  if (confirm('Eliminare questo ordine?')) {
    window.data.ordini.splice(i, 1);
    saveDB();
    renderAdminOrdini();
    updateStats();
    toast('Ordine eliminato');
  }
}

function viewOrdine(i) {
  const o       = window.data.ordini[i];
  const pagLabel = o.pagamento === 'bonifico' ? '🏦 Bonifico' : o.pagamento === 'assegno' ? '📄 Assegno' : '🏪 Ritiro';
  document.getElementById('ordineDetailContent').innerHTML = `
    <div class="ordine-detail-grid">
      <div class="detail-row"><span class="dl">N° Ordine</span><span class="dv" style="font-family:monospace;">${o.id}</span></div>
      <div class="detail-row"><span class="dl">Data</span><span class="dv">${o.data}</span></div>
      <div class="detail-row"><span class="dl">Cliente</span><span class="dv">${o.cliente}</span></div>
      <div class="detail-row"><span class="dl">Email</span><span class="dv">${o.email}</span></div>
      <div class="detail-row"><span class="dl">Telefono</span><span class="dv">${o.tel || '–'}</span></div>
      <div class="detail-row"><span class="dl">Indirizzo</span><span class="dv">${o.indirizzo || '–'} ${o.citta || ''}</span></div>
      <div class="detail-row"><span class="dl">Prodotti</span><span class="dv">${renderProdottiDetail(o)}</span></div>
      <div class="detail-row"><span class="dl">Certificato/i</span><span class="dv">${o.cert || '–'}</span></div>
      <div class="detail-row"><span class="dl">Pagamento</span><span class="dv">${pagLabel}</span></div>
      <div class="detail-row"><span class="dl">Stato</span><span class="dv"><span class="status-badge ${o.stato}">${o.stato.replace('_', ' ')}</span></span></div>
    </div>
    ${o.note ? `<div style="margin-bottom:16px;"><div class="dl" style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--testo2);font-weight:600;margin-bottom:4px;">Note</div>
      <div style="background:var(--acqua2);border-radius:8px;padding:12px;font-size:14px;">${o.note}</div></div>` : ''}
    ${o.ricevuta ? `<div><div class="dl" style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--testo2);font-weight:600;margin-bottom:8px;">Ricevuta allegata</div>
      ${o.ricevuta.startsWith('data:image')
        ? `<img src="${o.ricevuta}" class="receipt-preview" style="max-width:100%;border-radius:8px;">`
        : `<a href="${o.ricevuta}" target="_blank" style="color:var(--azzurro);font-weight:600;">📎 ${o.ricevutaNome || 'Visualizza PDF'}</a>`}
    </div>` : ''}
    <div style="margin-top:20px;display:flex;gap:10px;">
      <select class="stato-select" onchange="changeOrdineStato(${i},this.value);document.querySelector('#ordineDetailContent .status-badge').textContent=this.options[this.selectedIndex].text.trim();">
        <option value="nuovo"         ${o.stato==='nuovo'          ?'selected':''}>🟢 Nuovo</option>
        <option value="in_lavorazione"${o.stato==='in_lavorazione' ?'selected':''}>🟡 In lavorazione</option>
        <option value="completato"    ${o.stato==='completato'     ?'selected':''}>🔵 Completato</option>
        <option value="annullato"     ${o.stato==='annullato'      ?'selected':''}>🔴 Annullato</option>
      </select>
      <button class="btn-submit" onclick="closeModal('ordineDetailModal');renderAdminOrdini();">Chiudi</button>
    </div>`;
  document.getElementById('ordineDetailModal').classList.add('open');
}

function viewRicevuta(i) {
  const o = window.data.ordini[i];
  if (!o.ricevuta) return;
  const win = window.open();
  win.document.write(`<html><body style="margin:0;background:#222;display:flex;align-items:center;justify-content:center;min-height:100vh;">
    ${o.ricevuta.startsWith('data:image')
      ? `<img src="${o.ricevuta}" style="max-width:95vw;max-height:95vh;border-radius:8px;">`
      : `<embed src="${o.ricevuta}" type="application/pdf" width="100%" height="100%" style="position:fixed;inset:0;">`}
  </body></html>`);
}

// ---- PRODOTTI ----
function renderAdminProdotti() {
  const el = document.getElementById('adminProductList');
  if (!el) return;
  let html = '';
  Object.keys(window.data.products).forEach(k => {
    window.data.products[k].forEach((p, i) => {
      html += `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--acqua2);">
        <div><strong style="font-size:14px;">${p.nome}</strong> <span style="font-size:12px;color:var(--testo2);">[${k}]</span><br>
        <span style="font-size:12px;color:var(--testo2);">${p.desc.substring(0, 60)}...</span></div>
        <button class="btn-danger" onclick="deleteProduct('${k}',${i})">Elimina</button>
      </div>`;
    });
  });
  el.innerHTML = html || '<p style="color:var(--testo2);font-size:14px;">Nessun prodotto</p>';
}

function deleteProduct(k, i) {
  if (confirm('Eliminare questo prodotto?')) {
    window.data.products[k].splice(i, 1);
    saveDB();
    renderAdminProdotti();
    renderAll();
    toast('Prodotto eliminato');
  }
}

function openProductModal() { document.getElementById('productModal').classList.add('open'); }

function saveProduct() {
  const sezione = document.getElementById('prod-sezione').value;
  const nome    = document.getElementById('prod-nome').value.trim();
  const desc    = document.getElementById('prod-desc').value.trim();
  const img     = document.getElementById('prod-img').value.trim();
  if (!nome || !desc) { toast('Inserisci nome e descrizione', 'error'); return; }
  if (!window.data.products[sezione]) window.data.products[sezione] = [];
  window.data.products[sezione].push({ nome, desc, img });
  saveDB();
  closeModal('productModal');
  document.getElementById('prod-nome').value = '';
  document.getElementById('prod-desc').value = '';
  document.getElementById('prod-img').value  = '';
  renderAdminProdotti();
  renderAll();
  toast('Prodotto aggiunto!', 'success');
}

// ---- LAVORI ----
function renderAdminLavori() {
  const el = document.getElementById('adminLavoriList');
  if (!el) return;
  el.innerHTML = window.data.lavori.map((l, i) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--acqua2);">
      <div><strong style="font-size:14px;">${l.titolo}</strong><br>
      <span style="font-size:12px;color:var(--testo2);">${l.desc.substring(0, 60)}</span></div>
      <button class="btn-danger" onclick="deleteLavoro(${i})">Elimina</button>
    </div>`).join('') || '<p style="color:var(--testo2);font-size:14px;">Nessun lavoro</p>';
}

function deleteLavoro(i) {
  if (confirm('Eliminare?')) {
    window.data.lavori.splice(i, 1);
    saveDB();
    renderAdminLavori();
    renderLavori();
    updateStats();
    toast('Lavoro eliminato');
  }
}

function openLavoroModal() { document.getElementById('lavoroModal').classList.add('open'); }

function saveLavoro() {
  const titolo = document.getElementById('lav-titolo').value.trim();
  const desc   = document.getElementById('lav-desc').value.trim();
  const img    = document.getElementById('lav-img').value.trim();
  if (!titolo) { toast('Inserisci il titolo', 'error'); return; }
  window.data.lavori.push({ titolo, desc, img });
  saveDB();
  closeModal('lavoroModal');
  document.getElementById('lav-titolo').value = '';
  document.getElementById('lav-desc').value   = '';
  document.getElementById('lav-img').value    = '';
  renderAdminLavori();
  renderLavori();
  updateStats();
  toast('Lavoro aggiunto!', 'success');
}

// ---- RECENSIONI ----
function renderAdminRecensioni() {
  const el = document.getElementById('adminRecensioniList');
  if (!el) return;
  el.innerHTML = window.data.recensioni.map((r, i) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--acqua2);">
      <div><strong style="font-size:14px;">${r.autore}</strong> ${'★'.repeat(r.stelle)}<br>
      <span style="font-size:12px;color:var(--testo2);">${r.testo.substring(0, 60)}</span></div>
      <button class="btn-danger" onclick="deleteRecensione(${i})">Elimina</button>
    </div>`).join('') || '<p style="color:var(--testo2);">Nessuna recensione</p>';
}

function deleteRecensione(i) {
  if (confirm('Eliminare?')) {
    window.data.recensioni.splice(i, 1);
    saveDB();
    renderAdminRecensioni();
    renderRecensioni();
    updateStats();
    toast('Recensione eliminata');
  }
}

function openRecensioneModal() { document.getElementById('recensioneModal').classList.add('open'); }

function saveRecensione() {
  const autore = document.getElementById('rec-autore').value.trim();
  const stelle = parseInt(document.getElementById('rec-stelle').value) || 5;
  const testo  = document.getElementById('rec-testo').value.trim();
  if (!autore || !testo) { toast('Inserisci autore e testo', 'error'); return; }
  window.data.recensioni.push({ autore, stelle: Math.min(5, Math.max(1, stelle)), testo });
  saveDB();
  closeModal('recensioneModal');
  document.getElementById('rec-autore').value = '';
  document.getElementById('rec-testo').value  = '';
  document.getElementById('rec-stelle').value = '5';
  renderAdminRecensioni();
  renderRecensioni();
  updateStats();
  toast('Recensione aggiunta!', 'success');
}

// ---- PROMO ----
function savePromo() {
  const t = document.getElementById('promoText').value.trim();
  if (!t) return;
  window.data.settings.promoBanner = t;
  saveDB();
  const text = `🌊 ${t} &nbsp;·&nbsp; ${t} &nbsp;·&nbsp; ${t} &nbsp;·&nbsp; ${t} &nbsp;·&nbsp; ${t} &nbsp;·&nbsp; `;
  document.querySelectorAll('#promoBanner span').forEach(b => { b.innerHTML = text; });
  toast('Banner aggiornato!', 'success');
}

// ---- IMPOSTAZIONI ----
function loadSettingsForm() {
  const s = window.data.settings;
  const fields = {
    'set-nome': 'nome', 'set-tel': 'tel', 'set-email': 'email',
    'set-indirizzo': 'indirizzo', 'set-iban': 'iban', 'set-adminuser': 'adminUser'
  };
  Object.keys(fields).forEach(id => {
    const el = document.getElementById(id);
    if (el && s[fields[id]]) el.value = s[fields[id]];
  });
}

function saveImpostazioni() {
  const s = window.data.settings;
  s.nome      = document.getElementById('set-nome').value      || s.nome;
  s.tel       = document.getElementById('set-tel').value       || s.tel;
  s.email     = document.getElementById('set-email').value     || s.email;
  s.indirizzo = document.getElementById('set-indirizzo').value || s.indirizzo;
  s.iban      = document.getElementById('set-iban').value      || s.iban;
  s.adminUser = document.getElementById('set-adminuser').value || s.adminUser;
  const newPass = document.getElementById('set-pass').value;
  if (newPass && newPass.length >= 6) {
    s.adminPass = newPass;
    document.getElementById('set-pass').value = '';
    toast('Password aggiornata!', 'success');
  }
  saveDB();
  toast('Impostazioni salvate!', 'success');
}

// ---- Chiudi modale su click esterno ----
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });
  // Enter key nel login
  ['adminUser','adminPass'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keyup', e => { if (e.key === 'Enter') adminLogin(); });
  });
});
