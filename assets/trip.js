/* Shared trip engine. Reads window.TRIP from each trip's trip-data.js. */
(function () {
  var T = window.TRIP;
  if (!T) { document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif">No trip data loaded.</p>'; return; }

  var M = function (q, id) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q) +
      (id ? '&query_place_id=' + id : '');
  };
  var D = function (s) {
    return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent((s.lat && s.lng) ? (s.lat + ',' + s.lng) : s.q) + '&travelmode=walking';
  };
  var P = function (q) { return 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(q); };
  var W = function (q) { return 'https://www.google.com/search?q=' + encodeURIComponent(q + ' official website'); };

  var FILTERS = [
    ['all', 'Everything'], ['nearby', 'Nearby now'], ['route', 'On route'],
    ['food', 'Food'], ['breakfast', 'Breakfast'], ['coffee', 'Coffee'], ['rest', 'Rest'],
    ['history', 'History'], ['kids', 'Kids'], ['free', 'Free'], ['optional', 'Optional'], ['book', 'To book']
  ];

  var current = T.days[0].id, filter = 'all', here = null, map, layer, routeToken = 0;
  var log = document.getElementById('log'), daynote = document.getElementById('daynote');

  function day() { for (var i = 0; i < T.days.length; i++) if (T.days[i].id === current) return T.days[i]; }
  function hasTag(s, t) { return (s.tags || []).indexOf(t) > -1; }

  document.getElementById('wordmark').innerHTML = T.title + '<em>' + T.accent + '</em>';
  document.getElementById('eyebrow').textContent = T.eyebrow || '';
  document.title = T.accent + ' — trip plan';

  document.getElementById('days').innerHTML = T.days.map(function (d, i) {
    return '<button class="day-btn" role="tab" aria-selected="' + (i === 0) + '" data-day="' + d.id + '">' + d.label + '</button>';
  }).join('');
  document.getElementById('filters').innerHTML = FILTERS.map(function (f) {
    return '<button class="f" data-f="' + f[0] + '" aria-pressed="' + (f[0] === 'all') + '">' + f[1] + '</button>';
  }).join('');

  function miles(a, b, c, d) {
    var R = 3958.8, r = function (x) { return x * Math.PI / 180; };
    var u = r(c - a), v = r(d - b);
    var q = Math.pow(Math.sin(u / 2), 2) + Math.cos(r(a)) * Math.cos(r(c)) * Math.pow(Math.sin(v / 2), 2);
    return R * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
  }
  function nearScheduled(s) {
    if (!s.lat) return false;
    var stops = day().stops;
    for (var i = 0; i < stops.length; i++) {
      var a = stops[i];
      if (!a.opt && a.lat && a !== s && miles(s.lat, s.lng, a.lat, a.lng) <= 0.28) return true;
    }
    return false;
  }
  function match(s) {
    if (filter === 'all') return true;
    if (filter === 'book') return !!s.flag;
    if (filter === 'optional') return !!s.opt;
    if (filter === 'nearby') return !!(here && s.lat && miles(here.lat, here.lng, s.lat, s.lng) <= 0.5);
    if (filter === 'route') return !!(s.opt && nearScheduled(s));
    if (filter === 'breakfast') return hasTag(s, 'breakfast') || /breakfast|pancake|waffle|brunch|biscuit/i.test((s.type || '') + ' ' + (s.what || ''));
    return hasTag(s, filter);
  }
  function distChip(s) {
    if (!here || !s.lat) return '';
    var mi = miles(here.lat, here.lng, s.lat, s.lng);
    var txt = mi < 0.19 ? Math.round(mi * 5280) + ' ft away'
      : mi < 3 ? mi.toFixed(1) + ' mi · ~' + Math.max(1, Math.round(mi * 20)) + ' min walk'
      : mi.toFixed(1) + ' mi away';
    return '<span class="chip dist">' + txt + '</span>';
  }
  function segmentChip(prev, s) {
    if (!prev || !prev.lat || !s.lat) return '';
    var mi = miles(prev.lat, prev.lng, s.lat, s.lng), feet = Math.round(mi * 5280);
    var dist = mi < 0.19 ? feet + ' ft' : mi.toFixed(1) + ' mi';
    return '<span class="chip walk">from prior ' + dist + ' · ~' + Math.max(1, Math.round(mi * 20)) + ' min</span>';
  }

  function initMap() {
    if (typeof L === 'undefined') return;
    map = L.map('map', { scrollWheelZoom: false }).setView([T.lat, T.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '' }).addTo(map);
    layer = L.layerGroup().addTo(map);
  }

  function routeSummary(text) {
    var legend = document.querySelector('.maplegend');
    if (!legend) return;
    var old = document.getElementById('route-summary');
    if (!old) {
      old = document.createElement('span'); old.id = 'route-summary';
      old.style.color = '#C08A3E'; old.style.fontWeight = '500'; legend.appendChild(old);
    }
    old.textContent = text || '';
  }

  function requestWalkingRoute(stops, token) {
    var sched = stops.filter(function (s) { return !s.opt && s.lat; });
    if (sched.length < 2 || !map) return;
    var coords = sched.map(function (s) { return s.lng + ',' + s.lat; }).join(';');
    var url = 'https://routing.openstreetmap.de/routed-foot/route/v1/driving/' + coords + '?overview=full&geometries=geojson&steps=false';
    fetch(url).then(function (r) { if (!r.ok) throw new Error('route'); return r.json(); }).then(function (d) {
      if (token !== routeToken || !d.routes || !d.routes[0]) return;
      var r = d.routes[0], latlngs = r.geometry.coordinates.map(function (p) { return [p[1], p[0]]; });
      L.polyline(latlngs, { color: '#C08A3E', weight: 4, opacity: 0.86, lineJoin: 'round' }).addTo(layer);
      routeSummary('Walking route · ' + (r.distance / 1609.344).toFixed(1) + ' mi · ~' + Math.max(1, Math.round(r.duration / 60)) + ' min moving');
    }).catch(function () {
      if (token !== routeToken) return;
      var pts = sched.map(function (s) { return [s.lat, s.lng]; });
      L.polyline(pts, { color: '#C08A3E', weight: 2, opacity: 0.55, dashArray: '7 7' }).addTo(layer);
      routeSummary('Route order shown · tap Navigate for street-by-street walking directions');
    });
  }

  function drawMap() {
    if (!map) return;
    routeToken++;
    var token = routeToken;
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
    if (filter === 'all') requestWalkingRoute(stops, token); else routeSummary(filter === 'nearby' ? 'Showing places within 0.5 mi of you' : 'Filtered view');
  }

  function render() {
    var d = day();
    daynote.textContent = d.note || '';
    var rows = [], prev = null;
    d.stops.forEach(function (s, i) {
      if (!match(s)) return;
      rows.push('<li class="stop' + (s.key ? ' key' : '') + (s.opt ? ' opt' : '') + '">' +
        '<span class="time">' + s.t + '</span><span class="knot">' + (i + 1) + '</span>' +
        '<button class="card" data-i="' + i + '"><span class="tapcue">Details →</span>' +
        '<p class="name">' + s.name + '</p><p class="what">' + s.what + '</p><span class="chips">' +
        (s.key ? '<span class="chip key">Don\'t miss</span>' : '') +
        (s.flag ? '<span class="chip act">Needs a call</span>' : '') +
        (s.dur ? '<span class="chip">' + s.dur + '</span>' : '') +
        (s.walk && s.walk !== '—' ? '<span class="chip walk">' + s.walk + '</span>' : '') +
        segmentChip(prev, s) + distChip(s) + '</span></button></li>');
      if (!s.opt && s.lat) prev = s;
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
    if (b.dataset.f === 'nearby' && !here) {
      document.getElementById('geo-btn').click();
      return;
    }
    [].forEach.call(document.querySelectorAll('.f'), function (x) { x.setAttribute('aria-pressed', 'false'); });
    b.setAttribute('aria-pressed', 'true'); filter = b.dataset.f; render();
  });

  var msg = document.getElementById('geo-msg');
  document.getElementById('geo-btn').addEventListener('click', function () {
    if (!navigator.geolocation) { msg.textContent = 'This browser will not share location.'; return; }
    msg.textContent = 'Finding you…';
    navigator.geolocation.getCurrentPosition(function (p) {
      here = { lat: p.coords.latitude, lng: p.coords.longitude };
      msg.textContent = 'Distances refreshed from where you are now. Tap again anytime to update.';
      render();
    }, function () {
      msg.textContent = 'Location was blocked. Allow it in your browser settings and try again.';
    }, { enableHighAccuracy: true, timeout: 9000, maximumAge: 30000 });
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
        strip += '<div class="wx-h">' + hr + ap + '<b>' + Math.round(d.hourly.temperature_2m[i]) + '°</b>' +
          (pr >= 30 ? '<span class="rain">' + pr + '%</span>' : '&nbsp;') + '</div>';
      }
      document.getElementById('wx').innerHTML =
        '<div class="wx-now">' + Math.round(c.temperature_2m) + '°</div>' +
        '<div class="wx-txt"><b>' + (WMO[c.weather_code] || '—') + ' · feels like ' +
        Math.round(c.apparent_temperature) + '°</b>Today high ' +
        Math.round(d.daily.temperature_2m_max[0]) + '° · rain ' +
        d.daily.precipitation_probability_max[0] + '%&nbsp; | &nbsp;Tomorrow ' +
        Math.round(d.daily.temperature_2m_max[1]) + '° · rain ' +
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
        '<p class="wx-alert">Rain likely around ' + hiT + ' (' + hi + '%). Move an indoor stop earlier.</p>';
    }).catch(function () {
      document.getElementById('wx').innerHTML = '<div class="wx-txt">Weather did not load. Check your connection and refresh.</div>';
    });
  }

  var scrim = document.getElementById('scrim'), sheet = document.getElementById('sheet');
  function openSheet(s) {
    document.getElementById('s-type').innerHTML = s.type || '';
    document.getElementById('s-name').innerHTML = s.name;
    document.getElementById('s-blurb').textContent = s.blurb || '';
    document.getElementById('s-flag').innerHTML = s.flag ? '<p class="heads-up">' + s.flag + '</p>' : '';
    var rows = [];
    if (s.hours) rows.push(['Hours', s.hours + ' <small style="display:block;color:#7A8A99">Stored trip hours — tap Live Maps below to confirm open-now status.</small>']);
    if (s.price) rows.push(['Cost', s.price]);
    if (s.rating) rows.push(['Rated', '<span class="stars">' + s.rating + ' ★</span> · ' + s.count + ' reviews']);
    if (s.dur) rows.push(['Time', s.dur]);
    if (here && s.lat) rows.push(['From you', miles(here.lat, here.lng, s.lat, s.lng).toFixed(1) + ' mi']);
    if (s.walk && s.walk !== '—') rows.push(['Getting there', s.walk]);
    if (s.addr) rows.push(['Where', s.addr]);
    document.getElementById('s-facts').innerHTML = rows.map(function (r) {
      return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
    }).join('');
    document.getElementById('s-alts').innerHTML = s.alts
      ? '<p class="alt-h">If that does not work</p>' + s.alts.map(function (a) {
          return '<a class="alt" target="_blank" rel="noopener" href="' + M(a.q, a.id) + '"><b>' + a.n + '</b><small>' + a.d + '</small></a>';
        }).join('') : '';
    var b = '<a class="btn" target="_blank" rel="noopener" href="' + D(s) + '">Navigate</a>' +
      '<a class="btn ghost" target="_blank" rel="noopener" href="' + M(s.q, s.pid) + '">Live Maps · hours · reviews</a>' +
      '<a class="btn ghost" target="_blank" rel="noopener" href="' + P(s.q) + '">Photos</a>' +
      '<a class="btn ghost" target="_blank" rel="noopener" href="' + W(s.q) + '">Official site</a>';
    if (s.phone) b += '<a class="btn ghost" href="tel:+1' + s.phone + '">Call</a>';
    document.getElementById('s-btns').innerHTML = b;
    scrim.classList.add('on'); sheet.classList.add('on'); sheet.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }
  function closeSheet() { scrim.classList.remove('on'); sheet.classList.remove('on'); document.body.style.overflow = ''; }
  log.addEventListener('click', function (e) { var c = e.target.closest('.card'); if (c) openSheet(day().stops[+c.dataset.i]); });
  scrim.addEventListener('click', closeSheet);
  document.getElementById('s-close').addEventListener('click', closeSheet);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });

  initMap(); render(); weather();
})();
