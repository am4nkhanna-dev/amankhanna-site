
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
  /* Home page intro: the logo animation plays centred, then flies to the top-left brand slot */
  (function () {
   var root = document.documentElement, ov = document.getElementById('intro');
   try {
    if (!ov) { return; }
    if (!root.classList.contains('intro-on')) { ov.parentNode.removeChild(ov); return; }
    var v = document.getElementById('introVid'), frame = document.getElementById('introFrame'), skip = document.getElementById('introSkip');
    var moving = false, done = false, begun = false, media = v, fb = false;
    window.scrollTo(0, 0);
    function finish() {
      if (done) { return; } done = true;
      root.classList.add('intro-show-brand');
      root.classList.remove('intro-on');
      try { sessionStorage.setItem('ak-intro', '1'); } catch (e) {}
      if (ov.parentNode) { ov.parentNode.removeChild(ov); }
    }
    function fallback() { finish(); } /* video blocked or unable to start: show the normal page, no intro */
    function migrate() {
      if (moving || done) { return; } moving = true;
      var logo = document.querySelector('.brand img');
      if (!logo) { finish(); return; }
      var fr = frame.getBoundingClientRect(), br = logo.getBoundingClientRect();
      var gx = fr.left + fr.width * 0.52, gy = fr.top + fr.height * 0.368, gw = fr.width * 0.304;
      var s = br.width / gw;
      var tx = br.left + br.width / 2 - gx, ty = br.top + br.height / 2 - gy;
      frame.style.transformOrigin = (gx - fr.left) + 'px ' + (gy - fr.top) + 'px';
      frame.style.transition = 'transform 0.6s cubic-bezier(.65,0,.35,1), opacity 0.35s ease';
      frame.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';
      ov.classList.add('go');
      setTimeout(function () { root.classList.add('intro-show-brand'); frame.style.opacity = '0'; }, 450);
      setTimeout(finish, 800);
    }
    v.addEventListener('timeupdate', function () { if (v.currentTime >= 5.4) { migrate(); } });
    v.addEventListener('ended', migrate);
    v.addEventListener('error', fallback);
    v.addEventListener('playing', function () { begun = true; });
    v.muted = true; v.defaultMuted = true; v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    var p = v.play(); if (p && p.catch) { p.catch(fallback); }
    setTimeout(function () { if (!begun) { fallback(); } }, 6000);
    setTimeout(migrate, 10000);
    if (skip) { skip.addEventListener('click', finish); }
   } catch (err) {
    root.classList.remove('intro-on'); root.classList.add('intro-show-brand');
    if (ov && ov.parentNode) { ov.parentNode.removeChild(ov); }
   }
  })();
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
    if (v === 'accepted' && !document.getElementById('cfBeacon')) {
      var s = document.createElement('script');
      s.id = 'cfBeacon'; s.defer = true; s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
      s.setAttribute('data-cf-beacon', '{"token": "f1adde8be0bd4f67a1f9df09eba98cd6"}');
      document.head.appendChild(s);
    }
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
