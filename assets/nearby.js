/* Nearby now + sticky action bar + next-stop highlight + legend on the map.
 *
 * Adapted after comparing against the parallel build, which handled the
 * standing-on-a-corner case better: controls within thumb reach, one button
 * that answers "what is near me right now" regardless of which day it belongs
 * to, and a visible marker for which stop is next.
 */
(function () {
  var pos = null;

  function mi(a, b, c, d) {
    var R = 3958.8, r = function (x) { return x * Math.PI / 180; };
    var u = r(c - a), v = r(d - b);
    var q = Math.pow(Math.sin(u / 2), 2) + Math.cos(r(a)) * Math.cos(r(c)) * Math.pow(Math.sin(v / 2), 2);
    return R * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
  }
  function strip(s) { var e = document.createElement('div'); e.innerHTML = s; return e.textContent; }
  function logged() {
    try { return JSON.parse(localStorage.getItem('trip-log:' + location.pathname)) || { visited: [], skipped: [] }; }
    catch (e) { return { visited: [], skipped: [] }; }
  }

  function everything() {
    var out = [];
    if (window.TRIP) window.TRIP.days.forEach(function (d) {
      d.stops.forEach(function (s) { if (s.lat) out.push({ s: s, day: d.label }); });
    });
    if (window.TROLLEY) window.TROLLEY.stops.forEach(function (t) {
      out.push({ s: { name: 'Trolley stop ' + t.n + ' \u2014 ' + t.name, what: t.what, q: t.name + ' St Augustine',
        lat: t.lat, lng: t.lng }, day: 'Trolley' });
    });
    return out;
  }

  function showNear() {
    var box = document.getElementById('nearbox');
    if (!pos) { box.innerHTML = '<div class="nearbox"><p class="lead">Finding you\u2026</p></div>'; }
    var st = logged();
    var list = everything().filter(function (x) {
      var n = strip(x.s.name);
      return !st.visited.some(function (v) { return v.name === n; });
    }).map(function (x) {
      x.d = mi(pos.lat, pos.lng, x.s.lat, x.s.lng); return x;
    }).sort(function (a, b) { return a.d - b.d; }).slice(0, 6);

    box.innerHTML = '<div class="nearbox"><h3>Nearby now</h3>' +
      '<p class="lead">Everything within reach of where you are standing, any day, ' +
      'closest first.</p>' +
      list.map(function (x) {
        var url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(x.s.q) +
          (x.s.pid ? '&query_place_id=' + x.s.pid : '');
        return '<a target="_blank" rel="noopener" href="' + url + '">' +
          '<p class="nn">' + x.s.name + '</p><p class="nw">' + (x.s.what || '') + '</p>' +
          '<span class="nm">' + (x.d < .19 ? Math.round(x.d * 5280) + ' ft' : x.d.toFixed(1) + ' mi') +
          ' \u00b7 ' + Math.max(1, Math.round(x.d * 20)) + ' min walk \u00b7 ' + x.day + '</span></a>';
      }).join('') + '</div>';
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function locate(then) {
    if (!navigator.geolocation) { pos = { lat: 29.8955, lng: -81.3135 }; then(); return; }
    navigator.geolocation.getCurrentPosition(function (p) {
      pos = { lat: p.coords.latitude, lng: p.coords.longitude }; then();
    }, function () { pos = { lat: 29.8955, lng: -81.3135 }; then(); },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 120000 });
  }

  function markNext() {
    var st = logged();
    var done = false;
    document.querySelectorAll('#log .stop').forEach(function (li) {
      if (done || li.classList.contains('trol')) return;
      var nameEl = li.querySelector('.name');
      if (!nameEl) return;
      var n = strip(nameEl.innerHTML);
      var isDone = st.visited.some(function (v) { return v.name === n; });
      var isSkip = st.skipped.indexOf(n) > -1;
      if (isDone || isSkip) return;
      li.classList.add('next');
      var chips = li.querySelector('.chips');
      if (chips && !chips.querySelector('.nextchip')) {
        var c = document.createElement('span');
        c.className = 'chip nextchip';
        c.textContent = 'Next up';
        chips.insertBefore(c, chips.firstChild);
      }
      done = true;
    });
  }

  function init() {
    var log = document.getElementById('log'), map = document.getElementById('map');
    if (!log || !map) { setTimeout(init, 150); return; }

    var legend = document.querySelector('.maplegend');
    if (legend) map.appendChild(legend);

    var box = document.createElement('div');
    box.id = 'nearbox';
    var note = document.querySelector('.daynote');
    note.parentNode.insertBefore(box, note);

    var bar = document.createElement('div');
    bar.className = 'actionbar';
    bar.innerHTML = '<button class="go" id="ab-near">Nearby now</button>' +
      '<button id="ab-loc">Where am I</button>' +
      '<button class="wet" id="ab-rain">\u2614 Raining</button>';
    document.body.appendChild(bar);

    document.getElementById('ab-near').onclick = function () { locate(showNear); };
    document.getElementById('ab-loc').onclick = function () {
      var g = document.getElementById('geo-btn');
      if (g) { g.click(); g.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    };
    document.getElementById('ab-rain').onclick = function () {
      var r = document.getElementById('rain-btn');
      if (r) { r.click(); r.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    };

    var rb = document.getElementById('rain-btn');
    if (rb) new MutationObserver(function () {
      document.getElementById('ab-rain').classList.toggle('hot', rb.classList.contains('hot'));
    }).observe(rb, { attributes: true, attributeFilter: ['class'] });

    new MutationObserver(function () { setTimeout(markNext, 80); })
      .observe(log, { childList: true });
    setTimeout(markNext, 300);
  }
  setTimeout(init, 260);
})();
