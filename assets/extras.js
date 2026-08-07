/* Backlog items: facilities layer, open-now status, per-leg distances.
 *
 * Facilities are transcribed from the City of St. Augustine directory boards
 * (restrooms, parking, information). Open-now is computed from the hours
 * already stored on each stop \u2014 no paid API involved.
 */
(function () {
  var FAC = [
    { t: 'wc', n: 'Restrooms \u00b7 Visitor Center', lat: 29.8985, lng: -81.3163, i: '\u1F6BB' },
    { t: 'wc', n: 'Restrooms \u00b7 Plaza de la Constituci\u00f3n', lat: 29.8925, lng: -81.3128 },
    { t: 'wc', n: 'Restrooms \u00b7 St. George St (mid)', lat: 29.8955, lng: -81.3131 },
    { t: 'wc', n: 'Restrooms \u00b7 Municipal Marina', lat: 29.8917, lng: -81.311 },
    { t: 'wc', n: 'Restrooms \u00b7 Castillo visitor area', lat: 29.8974, lng: -81.3121 },
    { t: 'p', n: 'Historic Downtown Parking Facility', lat: 29.8985, lng: -81.3161 },
    { t: 'p', n: 'Parking \u00b7 Old Jail depot (free with trolley)', lat: 29.9057, lng: -81.3235 },
    { t: 'p', n: 'Parking \u00b7 Lighthouse (free)', lat: 29.8853, lng: -81.2883 },
    { t: 'i', n: 'Visitor Information Center', lat: 29.8987, lng: -81.3164 },
    { t: 'i', n: 'Civic Center information', lat: 29.8983, lng: -81.3158 }
  ];
  var ICON = { wc: 'WC', p: 'P', i: 'i' };
  var on = { wc: false, p: false, i: false };
  var layer = null;

  function mi(a, b, c, d) {
    var R = 3958.8, r = function (x) { return x * Math.PI / 180; };
    var u = r(c - a), v = r(d - b);
    var q = Math.pow(Math.sin(u / 2), 2) + Math.cos(r(a)) * Math.cos(r(c)) * Math.pow(Math.sin(v / 2), 2);
    return R * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
  }

  /* ---- open now ---- */
  function parseTime(s) {
    var m = s.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
    if (!m) return null;
    var h = +m[1] % 12;
    if (/PM/i.test(m[3])) h += 12;
    return h * 60 + (m[2] ? +m[2] : 0);
  }
  function status(hours) {
    if (!hours) return null;
    if (/always open/i.test(hours)) return { k: 'open', txt: 'Always open' };
    var parts = hours.split(/\u2013|--|\bto\b/);
    if (parts.length < 2) return null;
    var o = parseTime(parts[0]), c = parseTime(parts[1]);
    if (o === null || c === null) return null;
    var d = new Date(), now = d.getHours() * 60 + d.getMinutes();
    if (now < o) return { k: 'shut', txt: 'Opens later' };
    if (now >= c) return { k: 'shut', txt: 'Closed now' };
    var left = c - now;
    if (left <= 60) return { k: 'soon', txt: 'Closes in ' + left + ' min' };
    return { k: 'open', txt: 'Open now' };
  }

  function annotate() {
    var prev = null;
    document.querySelectorAll('#log .stop').forEach(function (li) {
      var chips = li.querySelector('.chips');
      if (!chips) return;
      var name = (li.querySelector('.name') || {}).textContent || '';

      if (!chips.querySelector('.open,.soon,.shut') && window.TRIP) {
        var hrs = null;
        window.TRIP.days.forEach(function (dd) {
          dd.stops.forEach(function (s) {
            var e = document.createElement('div'); e.innerHTML = s.name;
            if (e.textContent === name.trim()) hrs = s.hours;
          });
        });
        var st = status(hrs);
        if (st) {
          var c = document.createElement('span');
          c.className = 'chip ' + st.k;
          c.textContent = st.txt;
          chips.appendChild(c);
        }
      }

      var here = null;
      if (window.TRIP) window.TRIP.days.forEach(function (dd) {
        dd.stops.forEach(function (s) {
          var e = document.createElement('div'); e.innerHTML = s.name;
          if (e.textContent === name.trim() && s.lat) here = s;
        });
      });
      if (here && prev && !chips.querySelector('.leg')) {
        var d = mi(prev.lat, prev.lng, here.lat, here.lng);
        if (d > 0.01) {
          var lc = document.createElement('span');
          lc.className = 'chip leg';
          lc.textContent = d.toFixed(1) + ' mi from last \u00b7 ' + Math.max(1, Math.round(d * 20)) + ' min';
          chips.appendChild(lc);
        }
      }
      if (here) prev = here;
    });
  }

  /* ---- facilities ---- */
  function drawFac() {
    var map = window.TRIP_MAP;
    if (!map) return;
    if (!layer) layer = L.layerGroup().addTo(map);
    layer.clearLayers();
    FAC.forEach(function (f) {
      if (!on[f.t]) return;
      L.marker([f.lat, f.lng], {
        icon: L.divIcon({ html: '<div class="facpin">' + ICON[f.t] + '</div>',
          className: '', iconSize: [21, 21], iconAnchor: [10, 10] }), title: f.n
      }).addTo(layer).bindPopup(f.n);
    });
  }

  function init() {
    var tb = document.querySelector('.toolbar');
    if (!tb || !window.TRIP_MAP) { setTimeout(init, 180); return; }
    var bar = document.createElement('div');
    bar.className = 'faclbar';
    bar.innerHTML = '<button data-t="wc" aria-pressed="false">Restrooms</button>' +
      '<button data-t="p" aria-pressed="false">Parking</button>' +
      '<button data-t="i" aria-pressed="false">Info</button>';
    tb.appendChild(bar);
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var t = b.dataset.t;
      on[t] = !on[t];
      b.setAttribute('aria-pressed', on[t] ? 'true' : 'false');
      drawFac();
    });
    var log = document.getElementById('log');
    new MutationObserver(function () { setTimeout(annotate, 110); })
      .observe(log, { childList: true });
    setTimeout(annotate, 400);
  }
  setTimeout(init, 320);
})();
