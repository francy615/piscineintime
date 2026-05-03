/* ========== PREVENTIVO ========== */

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('preventivoForm');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const fb = document.getElementById('preventivoFeedback');
    fb.style.display = 'block';
    fb.style.background = '#d4edda';
    fb.style.color = '#155724';
    fb.innerHTML = '✅ <strong>Richiesta inviata con successo!</strong> Ti risponderemo entro 24 ore lavorative via email.';
    form.reset();
    toast('Richiesta preventivo inviata! ✅', 'success');
  });
});

// ========== PREVENTIVO INLINE NELLA PAGINA PISCINE ==========
function submitPreventivoPiscine() {
  const nome = document.getElementById('prevNome')?.value.trim();
  const cognome = document.getElementById('prevCognome')?.value.trim();
  const email = document.getElementById('prevEmail')?.value.trim();
  const tel = document.getElementById('prevTel')?.value.trim();
  const tipo = document.getElementById('prevTipo')?.value;
  const consenso = document.getElementById('prevConsenso')?.checked;
  const fb = document.getElementById('preventivoFeedbackPiscine');

  if (!nome || !cognome) { if(typeof toast === 'function') toast('Inserisci nome e cognome', 'error'); return; }
  if (!email || !email.includes('@')) { if(typeof toast === 'function') toast('Inserisci un\'email valida', 'error'); return; }
  if (!tel) { if(typeof toast === 'function') toast('Inserisci il numero di telefono', 'error'); return; }
  if (!tipo) { if(typeof toast === 'function') toast('Seleziona il tipo di piscina', 'error'); return; }
  if (!consenso) { if(typeof toast === 'function') toast('Accetta il trattamento dei dati', 'error'); return; }

  if (fb) {
    fb.style.display = 'block';
    fb.style.background = 'linear-gradient(135deg,#f0fff4,#e6faf0)';
    fb.style.color = '#276749';
    fb.style.border = '1.5px solid #9AE6B4';
    fb.innerHTML = '✅ <strong>Richiesta inviata!</strong> Ti risponderemo entro due giorni lavorativi all\'indirizzo ' + email;
  }

  ['prevNome','prevCognome','prevEmail','prevTel','prevDimensioni','prevNote'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const tipo_el = document.getElementById('prevTipo'); if (tipo_el) tipo_el.value = '';
  const cons_el = document.getElementById('prevConsenso'); if (cons_el) cons_el.checked = false;

  if(typeof toast === 'function') toast('Preventivo richiesto con successo! ✅', 'success');
}
