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
    inner.innerHTML =
      '<div style="padding:12px 18px 8px;font-size:12px;color:var(--testo2);border-bottom:1px solid var(--acqua2);">👤 ' + user.nome + ' ' + user.cognome + '</div>' +
      '<a href="#" onclick="doLogout();return false;" style="color:var(--rosso)!important;">🚪 Esci</a>';
    mobileSection.innerHTML =
      '<a href="#" style="color:var(--testo2);font-size:13px;" onclick="return false;">👤 ' + user.nome + '</a>' +
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
