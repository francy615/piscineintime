/* ========== SISTEMA UTENTI ========== */

function getUsers() {
  try { return JSON.parse(localStorage.getItem('pi_users') || '[]'); } catch(e) { return []; }
}
function saveUsers(u) { localStorage.setItem('pi_users', JSON.stringify(u)); }
function getCurrentUser() {
  try { return JSON.parse(sessionStorage.getItem('pi_currentUser') || 'null'); } catch(e) { return null; }
}
function setCurrentUser(u) { sessionStorage.setItem('pi_currentUser', JSON.stringify(u)); }
function logoutCurrentUser() { sessionStorage.removeItem('pi_currentUser'); }

/* Aggiorna UI nav utente */
function updateUserNav() {
  var user = getCurrentUser();
  var label = document.getElementById('navUserLabel');
  var chevron = document.getElementById('navUserChevron');
  var inner = document.getElementById('navUserDropdownInner');
  var mobileSection = document.getElementById('mobileUserSection');

  if (user) {
    label.textContent = user.nome;
    chevron.style.display = 'inline';
    var initial = user.nome.charAt(0).toUpperCase();

    // Count user orders
    var tutti = (window.data && window.data.ordini) ? window.data.ordini : [];
    var miei = tutti.filter(function(o){ return o.email && o.email.toLowerCase() === user.email.toLowerCase(); });
    var nuovi = miei.filter(function(o){ return (o.stato || 'nuovo') === 'nuovo'; }).length;
    var orderBadge = miei.length > 0
      ? '<span style="background:linear-gradient(135deg,var(--azzurro),var(--azzurro-scuro));color:#fff;font-size:10px;font-weight:800;border-radius:20px;padding:2px 9px;margin-left:auto;">' + miei.length + '</span>'
      : '';
    var newBadge = nuovi > 0
      ? '<span style="background:#d1fae5;color:#065f46;font-size:10px;font-weight:800;border-radius:20px;padding:2px 8px;margin-left:4px;">' + nuovi + ' nuov' + (nuovi===1?'o':'i') + '</span>'
      : '';

    inner.innerHTML =
      // Header profilo
      '<div style="padding:18px 20px 14px;border-bottom:1px solid rgba(11,111,164,0.08);">' +
        '<div style="display:flex;align-items:center;gap:12px;">' +
          '<div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--azzurro),var(--azzurro-scuro));color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;flex-shrink:0;box-shadow:0 4px 14px rgba(11,111,164,0.3);">' + initial + '</div>' +
          '<div style="min-width:0;">' +
            '<div style="font-weight:700;color:var(--testo);font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + user.nome + ' ' + user.cognome + '</div>' +
            '<div style="font-size:11.5px;color:var(--testo2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + user.email + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      // Voce: I miei ordini
      '<a href="#" onclick="showPage(\'miei-ordini\');document.getElementById(\'navUserDropdown\').closest(\'.nav-item\').classList.remove(\'open\');return false;" ' +
        'style="display:flex;align-items:center;gap:12px;padding:13px 20px;font-size:13.5px;color:var(--testo)!important;text-decoration:none;transition:all .18s;border-left:3px solid transparent;" ' +
        'onmouseover="this.style.background=\'linear-gradient(90deg,var(--acqua2),transparent)\';this.style.color=\'var(--azzurro)\';this.style.borderLeftColor=\'var(--azzurro)\';this.style.paddingLeft=\'26px\';" ' +
        'onmouseout="this.style.background=\'\';this.style.color=\'var(--testo)\';this.style.borderLeftColor=\'transparent\';this.style.paddingLeft=\'20px\';">' +
        '<span style="font-size:18px;">📦</span>' +
        '<span style="flex:1;">I miei ordini</span>' +
        orderBadge + newBadge +
      '</a>' +
      // Divider + logout
      '<div style="border-top:1px solid rgba(11,111,164,0.07);padding:8px 12px;">' +
        '<a href="#" onclick="doLogout();return false;" ' +
          'style="display:flex;align-items:center;gap:10px;padding:9px 10px;font-size:13px;color:var(--rosso)!important;text-decoration:none;border-radius:10px;transition:background .18s;" ' +
          'onmouseover="this.style.background=\'#fff5f5\';" onmouseout="this.style.background=\'\';">' +
          '<span style="font-size:16px;">🚪</span><span>Esci dall\'account</span>' +
        '</a>' +
      '</div>';

    mobileSection.innerHTML =
      '<a href="#" style="color:var(--testo2);font-size:13px;font-weight:600;pointer-events:none;display:flex;align-items:center;gap:8px;">' +
        '<span style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--azzurro),var(--azzurro-scuro));color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;">' + initial + '</span>' +
        user.nome + ' ' + user.cognome +
      '</a>' +
      '<a href="#" onclick="showPage(\'miei-ordini\');toggleMobileNav();return false;">📦 I miei ordini' + (miei.length > 0 ? ' (' + miei.length + ')' : '') + '</a>' +
      '<a href="#" onclick="doLogout();toggleMobileNav();return false;" style="color:var(--rosso);">🚪 Esci</a>';
  } else {
    label.textContent = 'Accedi';
    chevron.style.display = 'none';
    inner.innerHTML = '';
    mobileSection.innerHTML =
      '<a href="#" onclick="openUserLogin();toggleMobileNav();return false;">👤 Accedi</a>' +
      '<a href="#" onclick="openUserRegister();toggleMobileNav();return false;">✨ Registrati</a>';
  }
}

function handleUserNavClick(e) {
  var user = getCurrentUser();
  if (!user) {
    openUserLogin();
  } else {
    navOpenItem(e.currentTarget, e);
  }
}

function openUserLogin() {
  document.getElementById('userLoginModal').classList.add('open');
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginUserErr').style.display = 'none';
}

function openUserRegister() {
  document.getElementById('userRegisterModal').classList.add('open');
  ['regNome','regCognome','regEmail','regTel','regPass','regPass2'].forEach(function(id){ document.getElementById(id).value=''; });
  document.getElementById('registerErr').style.display = 'none';
}

function switchToRegister() {
  closeModal('userLoginModal');
  openUserRegister();
}

function switchToLogin() {
  closeModal('userRegisterModal');
  openUserLogin();
}

function userLogin() {
  var email = document.getElementById('loginEmail').value.trim().toLowerCase();
  var pass  = document.getElementById('loginPass').value;
  var errEl = document.getElementById('loginUserErr');
  if (!email || !pass) { showErr(errEl, 'Compila tutti i campi.'); return; }
  var users = getUsers();
  var found = users.find(function(u){ return u.email === email && u.pass === pass; });
  if (!found) { showErr(errEl, 'Email o password non corretti.'); return; }
  setCurrentUser(found);
  closeModal('userLoginModal');
  updateUserNav();
  if (typeof refreshOrdiniView === 'function') refreshOrdiniView();
  toast('Benvenuto, ' + found.nome + '! 👋', 'success');
}

function userRegister() {
  var nome    = document.getElementById('regNome').value.trim();
  var cognome = document.getElementById('regCognome').value.trim();
  var email   = document.getElementById('regEmail').value.trim().toLowerCase();
  var tel     = document.getElementById('regTel').value.trim();
  var pass    = document.getElementById('regPass').value;
  var pass2   = document.getElementById('regPass2').value;
  var errEl   = document.getElementById('registerErr');

  if (!nome || !cognome || !email || !pass) { showErr(errEl, 'Compila tutti i campi obbligatori.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr(errEl, 'Email non valida.'); return; }
  if (pass.length < 6) { showErr(errEl, 'La password deve avere almeno 6 caratteri.'); return; }
  if (pass !== pass2) { showErr(errEl, 'Le password non coincidono.'); return; }

  var users = getUsers();
  if (users.find(function(u){ return u.email === email; })) { showErr(errEl, 'Questa email è già registrata.'); return; }

  var newUser = { nome: nome, cognome: cognome, email: email, tel: tel, pass: pass, creato: new Date().toLocaleDateString('it-IT') };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  closeModal('userRegisterModal');
  updateUserNav();
  if (typeof refreshOrdiniView === 'function') refreshOrdiniView();
  toast('Account creato! Benvenuto, ' + nome + '! 🎉', 'success');
}

function doLogout() {
  var user = getCurrentUser();
  logoutCurrentUser();
  updateUserNav();
  if (typeof refreshOrdiniView === 'function') refreshOrdiniView();
  toast('Arrivederci' + (user ? ', ' + user.nome : '') + '! 👋');
}

function showErr(el, msg) {
  el.textContent = msg;
  el.style.display = 'block';
}

/* Inizializza al caricamento */
document.addEventListener('DOMContentLoaded', function(){
  updateUserNav();
  renderAll();
});
