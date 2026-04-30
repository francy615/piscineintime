/* ========== NAVIGAZIONE MENU ========== */

// Apre/chiude il dropdown principale (es. "Ramo Piscine")
function navOpenItem(el, e) {
  e.stopPropagation();
  var item = el.closest('.nav-item');
  var isOpen = item.classList.contains('open');
  // Chiudi tutti gli altri dropdown
  document.querySelectorAll('.nav-item.open').forEach(function(i) {
    if (i !== item) i.classList.remove('open');
  });
  if (!isOpen) {
    item.classList.add('open');
  } else {
    item.classList.remove('open');
  }
}

// Chiudi dropdown cliccando fuori
document.addEventListener('click', function(e) {
  if (!e.target.closest('.nav-item')) {
    document.querySelectorAll('.nav-item.open').forEach(function(i) {
      i.classList.remove('open');
    });
  }
});