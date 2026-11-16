
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
  var vids = document.querySelectorAll('video.rv');
  if (vids.length) {
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var go = function (v) { var p = v.play(); if (p && p.catch) { p.catch(function () {}); } };
    if (!still) {
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { go(e.target); io.unobserve(e.target); } });
        }, { threshold: 0.5 });
        vids.forEach(function (v) { io.observe(v); });
      } else { vids.forEach(go); }
    }
  }
  /* Cookie notice: remembers a choice on this device; analytics may only load after "accept" */
  var KEY = 'ak-cookies', bar = document.getElementById('cookieBar');
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function apply(v) {
    window.akCookieChoice = v;
    try { document.dispatchEvent(new CustomEvent('ak-cookie-choice', { detail: v })); } catch (e) {}
  }
  if (bar) {
    var saved = get();
    if (saved) { apply(saved); } else { bar.hidden = false; }
    bar.addEventListener('click', function (e) {
      var c = e.target.getAttribute && e.target.getAttribute('data-choice');
      if (!c) { return; }
      set(c); apply(c); bar.hidden = true;
    });
    var again = document.getElementById('cookieSettings');
    if (again) { again.addEventListener('click', function (e) { e.preventDefault(); bar.hidden = false; var b = bar.querySelector('button'); if (b) { b.focus(); } }); }
  }
})();
