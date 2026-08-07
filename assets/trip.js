/* Shared trip engine. Reads window.TRIP from each trip's trip-data.js. */
(function () {
  var T = window.TRIP;
  if (!T) { document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif">No trip data loaded.</p>'; return; }

  var M = function (q, id) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q) +
      (id ? '&query_place_id=' + id : '');
  };
  var P = function (q) { return 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(q); };

  var FILTERS = [['all', 'Everything'], ['food', 'Food'], ['coffee', 'Coffee'], ['rest', 'Rest'],
    ['history', 'History'], ['kids', 'Kids'], ['free', 'Free'], ['book', 'To book']];

  var current = T.days[0].id, filter = 'all', here = null, map, layer;
  var log = document.getElementById('log'), daynote = document.getElementById('daynote');

  function day() { for (var i = 0; i < T.days.length; i++) if (T.days[i].id === current) return T.days[i]; }

  document.getElementById('wordmark').innerHTML = T.title + '<em>' + T.accent + '</em>';
  document.getElementById('eyebrow').textContent = T.eyebrow || '';
  document.title = T.accent + ' \u2014 trip plan';

  document.getElementById('days').innerHTML = T.days.map(function (d, i) {
    return '<button class="day-btn" role="tab" aria-selected="' + (i === 0) + '" data-day="' + d.id + '">' +
      d.label + '</button>';
  }).join('');
  document.getElementById('filters').innerHTML = FILTERS.map(function (f) {
    return '<button class="f" data-f="' + f[0] + '" aria-pressed="' + (f[0] === 'all') + '">' + f[1] + '</button>';
  }).join('');

  function match(s) {
    if (filter === 'all') return true;
    if (filter === 'book') return !!s.flag;
    return (s.tags || []).indexOf(filter) > -1;
  }
  function miles(a, b, c, d) {
    var R = 3958.8, r = function (x) { return x * Math.PI / 180; };
    var u = r(c - a), v = r(d - b);
    var q = Math.pow(Math.sin(u / 2), 2) + Math.cos(r(a)) * Math.cos(r(c)) * Math.pow(Math.sin(v / 2), 2);
    return R * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
  }
  function distChip(s) {
    if (!here || !s.lat) return '';
    var mi = miles(here.lat, here.lng, s.lat, s.lng);
    var txt = mi < 0.19 ? Math.round(mi * 5280) + ' ft away'
      : mi < 3 ? mi.toFixed(1) + ' mi \u00b7 ' + Math.round(mi * 20) + ' min walk'
      : mi.toFixed(1) + ' mi away';
    return '<span class="chip dist">' + txt + '</span>';
  }

  function initMap() {
    if (typeof L === 'undefined') return;
    map = L.map('map', { scrollWheelZoom: false }).setView([T.lat, T.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '' }).addTo(map);
    layer = L.layerGroup().addTo(map);
  }
  function drawMap() {
    if (!map) return;
    layer.clearLayers();
    var stops = day().stops, pts = [];
    stops.forEach(function (s, i) {
      if (!match(s) || !s.lat) return;
      var icon = L.divIcon({
        html: '<div class="pin' + (s.key ? ' key' : '') + (s.opt ? ' opt' : '') + '">' + (i + 1) + '</div>',
        className: '', iconSize: [26, 26], iconAnchor: [13, 13]
      });
      L.marker([s.lat, s.lng], { icon: icon, title: s.name }).addTo(layer)
        .on('click', function () { openSheet(s); });
      pts.push([s.lat, s.lng]);
    });
    if (here) {
      pts.push([here.lat, here.lng]);
      L.marker([here.lat, here.lng], {
        icon: L.divIcon({ html: '<div class="me"></div>', className: '', iconSize: [16, 16], iconAnchor: [8, 8] }),
        title: 'You'
      }).addTo(layer);
    }
    if (pts.length) map.fitBounds(pts, { padding: [38, 38], maxZoom: 16 });
  }

  function render() {
    var d = day();
    daynote.textContent = d.note || '';
    var rows = [];
    d.stops.forEach(function (s, i) {
      if (!match(s)) return;
      rows.push('<li class="stop' + (s.key ? ' key' : '') + (s.opt ? ' opt' : '') + '">' +
        '<span class="time">' + s.t + '</span><span class="knot">' + (i + 1) + '</span>' +
        '<button class="card" data-i="' + i + '"><span class="tapcue">Details \u2192</span>' +
        '<p class="name">' + s.name + '</p><p class="what">' + s.what + '</p><span class="chips">' +
        (s.key ? '<span class="chip key">Don\'t miss</span>' : '') +
        (s.flag ? '<span class="chip act">Needs a call</span>' : '') +
        (s.dur ? '<span class="chip">' + s.dur + '</span>' : '') +
        (s.walk && s.walk !== '\u2014' ? '<span class="chip walk">' + s.walk + '</span>' : '') +
        distChip(s) + '</span></button></li>');
    });
    log.innerHTML = rows.length ? rows.join('')
      : '<p class="empty">Nothing in this day matches that filter. Tap Everything to go back.</p>';
    drawMap();
  }

  document.getElementById('days').addEventListener('click', function (e) {
    var b = e.target.closest('.day-btn'); if (!b) return;
    [].forEach.call(document.querySelectorAll('.day-btn'), function (x) { x.setAttribute('aria-selected', 'false'); });
    b.setAttribute('aria-selected', 'true'); current = b.dataset.day; render();
  });
  document.getElementById('filters').addEventListener('click', function (e) {
    var b = e.target.closest('.f'); if (!b) return;
    [].forEach.call(document.querySelectorAll('.f'), function (x) { x.setAttribute('aria-pressed', 'false'); });
    b.setAttribute('aria-pressed', 'true'); filter = b.dataset.f; render();
  });

  var msg = document.getElementById('geo-msg');
  document.getElementById('geo-btn').addEventListener('click', function () {
    if (!navigator.geolocation) { msg.textContent = 'This browser will not share location.'; return; }
    msg.textContent = 'Finding you\u2026';
    navigator.geolocation.getCurrentPosition(function (p) {
      here = { lat: p.coords.latitude, lng: p.coords.longitude };
      msg.textContent = 'Distances are from where you are now. Tap again to refresh.';
      render();
    }, function () {
      msg.textContent = 'Location was blocked. Allow it in your browser settings and try again.';
    }, { enableHighAccuracy: true, timeout: 9000, maximumAge: 60000 });
  });

  var WMO = { 0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    71: 'Snow', 80: 'Rain showers', 81: 'Rain showers', 82: 'Violent showers', 95: 'Thunderstorms',
    96: 'Thunderstorms', 99: 'Thunderstorms' };

  function weather() {
    var u = 'https://api.open-meteo.com/v1/forecast?latitude=' + T.lat + '&longitude=' + T.lng +
      '&current=temperature_2m,apparent_temperature,weather_code' +
      '&hourly=temperature_2m,precipitation_probability' +
      '&daily=temperature_2m_max,precipitation_probability_max' +
      '&temperature_unit=fahrenheit&timezone=' + encodeURIComponent(T.tz || 'auto') + '&forecast_days=3';
    fetch(u).then(function (r) { return r.json(); }).then(function (d) {
      var c = d.current, now = new Date(c.time), strip = '', idx = 0;
      for (var j = 0; j < d.hourly.time.length; j++) { if (new Date(d.hourly.time[j]) > now) { idx = j; break; } }
      for (var i = idx; i < idx + 5 && i < d.hourly.time.length; i++) {
        var h = new Date(d.hourly.time[i]), hr = h.getHours(), ap = hr >= 12 ? 'p' : 'a';
        hr = hr % 12 || 12;
        var pr = d.hourly.precipitation_probability[i];
        strip += '<div class="wx-h">' + hr + ap + '<b>' + Math.round(d.hourly.temperature_2m[i]) + '\u00b0</b>' +
          (pr >= 30 ? '<span class="rain">' + pr + '%</span>' : '&nbsp;') + '</div>';
      }
      document.getElementById('wx').innerHTML =
        '<div class="wx-now">' + Math.round(c.temperature_2m) + '\u00b0</div>' +
        '<div class="wx-txt"><b>' + (WMO[c.weather_code] || '\u2014') + ' \u00b7 feels like ' +
        Math.round(c.apparent_temperature) + '\u00b0</b>Today high ' +
        Math.round(d.daily.temperature_2m_max[0]) + '\u00b0 \u00b7 rain ' +
        d.daily.precipitation_probability_max[0] + '%&nbsp; | &nbsp;Tomorrow ' +
        Math.round(d.daily.temperature_2m_max[1]) + '\u00b0 \u00b7 rain ' +
        d.daily.precipitation_probability_max[1] + '%<div class="wx-strip">' + strip + '</div></div>';
      var hi = 0, hiT = '';
      for (var k = idx; k < idx + 9 && k < d.hourly.time.length; k++) {
        if (d.hourly.precipitation_probability[k] > hi) {
          hi = d.hourly.precipitation_probability[k];
          var t = new Date(d.hourly.time[k]).getHours();
          hiT = (t % 12 || 12) + ' ' + (t >= 12 ? 'PM' : 'AM');
        }
      }
      if (hi >= 50) document.getElementById('wx-extra').innerHTML =
        '<p class="wx-alert">Rain likely around ' + hiT + ' (' + hi +
        '%). Move an indoor stop earlier.</p>';
    }).catch(function () {
      document.getElementById('wx').innerHTML =
        '<div class="wx-txt">Weather did not load. Check your connection and refresh.</div>';
    });
  }

  var scrim = document.getElementById('scrim'), sheet = document.getElementById('sheet');
  function openSheet(s) {
    document.getElementById('s-type').innerHTML = s.type || '';
    document.getElementById('s-name').innerHTML = s.name;
    document.getElementById('s-blurb').textContent = s.blurb || '';
    document.getElementById('s-flag').innerHTML = s.flag ? '<p class="heads-up">' + s.flag + '</p>' : '';
    var rows = [];
    if (s.hours) rows.push(['Open', s.hours]);
    if (s.price) rows.push(['Cost', s.price]);
    if (s.rating) rows.push(['Rated', '<span class="stars">' + s.rating + ' \u2605</span> \u00b7 ' + s.count + ' reviews']);
    if (s.dur) rows.push(['Time', s.dur]);
    if (here && s.lat) rows.push(['From you', miles(here.lat, here.lng, s.lat, s.lng).toFixed(1) + ' mi']);
    if (s.walk && s.walk !== '\u2014') rows.push(['Getting there', s.walk]);
    if (s.addr) rows.push(['Where', s.addr]);
    document.getElementById('s-facts').innerHTML = rows.map(function (r) {
      return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
    }).join('');
    document.getElementById('s-alts').innerHTML = s.alts
      ? '<p class="alt-h">If that does not work</p>' + s.alts.map(function (a) {
          return '<a class="alt" target="_blank" rel="noopener" href="' + M(a.q, a.id) + '"><b>' +
            a.n + '</b><small>' + a.d + '</small></a>';
        }).join('')
      : '';
    var b = '<a class="btn" target="_blank" rel="noopener" href="' + M(s.q, s.pid) + '">Maps &amp; reviews</a>' +
      '<a class="btn ghost" target="_blank" rel="noopener" href="' + P(s.q) + '">Photos</a>';
    if (s.phone) b += '<a class="btn ghost" href="tel:+1' + s.phone + '">Call</a>';
    document.getElementById('s-btns').innerHTML = b;
    scrim.classList.add('on'); sheet.classList.add('on'); sheet.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }
  function closeSheet() {
    scrim.classList.remove('on'); sheet.classList.remove('on'); document.body.style.overflow = '';
  }
  log.addEventListener('click', function (e) {
    var c = e.target.closest('.card'); if (c) openSheet(day().stops[+c.dataset.i]);
  });
  scrim.addEventListener('click', closeSheet);
  document.getElementById('s-close').addEventListener('click', closeSheet);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });

  initMap(); render(); weather();
})();
