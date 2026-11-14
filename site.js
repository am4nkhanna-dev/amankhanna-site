
(function () {
  var btn = document.getElementById('menuBtn'), nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  var y = document.getElementById('year');
  if (y) { y.textContent = new Date().getFullYear(); }
  var v = document.getElementById('reveal');
  if (v) {
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!still) { var p = v.play(); if (p && p.catch) { p.catch(function () {}); } }
  }
})();
