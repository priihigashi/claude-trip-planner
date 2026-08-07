/* Fourth tab: "Where we went".
 *
 * Day tabs 1..N stay exactly as planned (dashed route, pink/purple/blue by day).
 * The extra tab shows only what actually happened, in the order it was logged,
 * as a solid route.
 *
 * Loaded BEFORE trip.js so it can capture the Leaflet map instance without
 * modifying the engine. State lives in localStorage; nothing leaves the phone.
 */
(function () {
  if (window.L && !L.__hooked) {
    var orig = L.map;
    L.map = function () { var m = orig.apply(this, arguments); window.TRIP_MAP = m; return m; };
    L.__hooked = true;
  }

  var COLORS = ['#E86A9B', '#9B6AE8', '#6AC7E8'];
  var KEY = 'trip-log:' + location.pathname;
  var state = { visited: [], skipped: [] };
  try { var raw = localStorage.getItem(KEY); if (raw) state = JSON.parse(raw); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  var actual = false, routes = null, here = null;

  function mi(a, b, c, d) {
    var R = 3958.8, r = function (x) { return x * Math.PI / 180; };
    var u = r(c - a), v = r(d - b);
    var q = Math.pow(Math.sin(u / 2), 2) + Math.cos(r(a)) * Math.cos(r(c)) * Math.pow(Math.sin(v / 2), 2);
    return R * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
  }
  function walkMin(d) { return Math.max(1, Math.round(d * 20)); }
  function strip(s) { var e = document.createElement('div'); e.innerHTML = s; return e.textContent; }
  function visited(n) { return state.visited.some(function (v) { return v.name === n; }); }
  function skipped(n) { return state.skipped.indexOf(n) > -1; }
  function dayIndex() {
    var b = document.querySelector('.day-btn[aria-selected="true"]');
    var all = [].slice.call(document.querySelectorAll('.day-btn'));
    var i = all.indexOf(b);
    return i < 0 ? 0 : i;
  }
  function allStops() {
    var out = [];
    window.TRIP.days.forEach(function (d, i) {
      d.stops.forEach(function (s) { out.push({ s: s, di: i }); });
    });
    return out;
  }

  function draw() {
    var map = window.TRIP_MAP;
    if (!map) return;
    if (!routes) routes = L.layerGroup().addTo(map);
    routes.clearLayers();

    if (!actual) {
      var di = dayIndex();
      var d = window.TRIP.days[di];
      if (!d) return;
      var pts = d.stops.filter(function (s) { return s.lat; }).map(function (s) { return [s.lat, s.lng]; });
      if (pts.length > 1) L.polyline(pts, {
        color: COLORS[di % 3], weight: 3, opacity: .8, dashArray: '2 8', lineCap: 'round'
      }).addTo(routes);
      return;
    }

    var byDay = {};
    state.visited.forEach(function (v) { (byDay[v.di] = byDay[v.di] || []).push(v); });
    var bounds = [];
    Object.keys(byDay).forEach(function (k) {
      var pts = byDay[k].map(function (v) { return [v.lat, v.lng]; });
      bounds = bounds.concat(pts);
      if (pts.length > 1) L.polyline(pts, {
        color: COLORS[k % 3], weight: 4, opacity: .95, lineCap: 'round'
      }).addTo(routes);
      pts.forEach(function (p, i) {
        L.circleMarker(p, { radius: 6, color: COLORS[k % 3], fillColor: COLORS[k % 3],
          fillOpacity: 1, weight: 2 }).addTo(routes);
      });
    });
    if (bounds.length) map.fitBounds(bounds, { padding: [45, 45], maxZoom: 16 });
  }

  function score(s) { return s.key ? 3 : s.opt ? 1 : 2; }
  function origin() {
    if (here) return { lat: here.lat, lng: here.lng, label: 'where you are now' };
    var last = state.visited[state.visited.length - 1];
    if (last) return { lat: last.lat, lng: last.lng, label: last.name };
    return null;
  }

  function fork() {
    var box = document.getElementById('forkbox');
    if (!box) return;
    var o = origin();
    if (!o) {
      box.innerHTML = '<div class="fork"><h3>Where next</h3><p class="from">Mark a stop as ' +
        '\u201cWent\u201d, or tap \u201cShow how far\u201d, and two options appear here.</p></div>';
      return;
    }
    var pool = allStops().filter(function (x) {
      return x.s.lat && !visited(strip(x.s.name)) && !skipped(strip(x.s.name));
    }).map(function (x) {
      return { s: x.s, di: x.di, d: mi(o.lat, o.lng, x.s.lat, x.s.lng), sc: score(x.s) };
    });
    if (!pool.length) { box.innerHTML = ''; return; }

    var near = pool.slice().sort(function (a, b) {
      return (b.sc / Math.max(b.d, .05)) - (a.sc / Math.max(a.d, .05)) || a.d - b.d;
    })[0];
    var big = pool.slice().sort(function (a, b) { return b.sc - a.sc || a.d - b.d; })[0];
    if (big && near && big.s === near.s) {
      big = pool.filter(function (p) { return p.s !== near.s; })
        .sort(function (a, b) { return b.sc - a.sc || a.d - b.d; })[0];
    }

    function card(p, tag, why) {
      if (!p) return '';
      var q = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.s.q) +
        (p.s.pid ? '&query_place_id=' + p.s.pid : '');
      return '<a class="opt" target="_blank" rel="noopener" href="' + q + '">' +
        '<span class="tag">' + tag + '</span><p class="t">' + p.s.name + '</p>' +
        '<p class="why">' + why + '</p><span class="m">' + p.d.toFixed(1) + ' mi \u00b7 ' +
        walkMin(p.d) + ' min walk' + (p.s.hours ? ' \u00b7 ' + p.s.hours : '') + '</span></a>';
    }

    box.innerHTML = '<div class="fork"><h3>Where next \u2014 pick a branch</h3>' +
      '<p class="from">From ' + o.label + '. Do one, or both in order.</p>' +
      card(near, 'Closest win', near.s.what) +
      card(big, 'Worth the walk', big ? big.s.what : '') +
      '<div class="addbox"><input id="add-in" placeholder="Went somewhere else? Type it">' +
      '<button id="add-go">Log</button></div><p class="addmsg" id="add-msg"></p></div>';
    document.getElementById('add-go').onclick = addCustom;
    document.getElementById('add-in').onkeydown = function (e) { if (e.key === 'Enter') addCustom(); };
  }

  function addCustom() {
    var inp = document.getElementById('add-in'), msg = document.getElementById('add-msg');
    var q = inp.value.trim(); if (!q) return;
    msg.textContent = 'Looking it up\u2026';
    fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
      encodeURIComponent(q + ', St. Augustine, FL'))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.length) { msg.textContent = 'Could not find that. Try a fuller name.'; return; }
        state.visited.push({ name: q, lat: +j[0].lat, lng: +j[0].lon, di: dayIndex(),
          t: Date.now(), custom: 1 });
        save(); inp.value = ''; msg.textContent = 'Logged.';
        if (actual) renderActual(); draw(); fork();
      })
      .catch(function () { msg.textContent = 'Lookup failed. Check your connection.'; });
  }

  function decorate() {
    if (actual) return;
    var di = dayIndex();
    document.querySelectorAll('#log .card').forEach(function (c) {
      if (c.querySelector('.logrow')) return;
      var n = strip(c.querySelector('.name').innerHTML);
      var li = c.closest('.stop');
      var row = document.createElement('div');
      row.className = 'logrow';
      row.innerHTML = '<button class="went' + (visited(n) ? ' on' : '') + '">\u2713 Went</button>' +
        '<button class="skip' + (skipped(n) ? ' on' : '') + '">Skipped</button>';
      c.appendChild(row);
      if (visited(n)) li.classList.add('went');
      if (skipped(n)) li.classList.add('skipped');

      row.querySelector('.went').onclick = function (e) {
        e.stopPropagation(); e.preventDefault();
        var stop = null;
        window.TRIP.days[di].stops.forEach(function (s) { if (strip(s.name) === n) stop = s; });
        if (visited(n)) {
          state.visited = state.visited.filter(function (v) { return v.name !== n; });
          this.classList.remove('on'); li.classList.remove('went');
        } else if (stop) {
          state.visited.push({ name: n, lat: stop.lat, lng: stop.lng, di: di, t: Date.now() });
          state.skipped = state.skipped.filter(function (x) { return x !== n; });
          this.classList.add('on'); li.classList.add('went'); li.classList.remove('skipped');
          row.querySelector('.skip').classList.remove('on');
        }
        save(); draw(); fork();
      };
      row.querySelector('.skip').onclick = function (e) {
        e.stopPropagation(); e.preventDefault();
        if (skipped(n)) {
          state.skipped = state.skipped.filter(function (x) { return x !== n; });
          this.classList.remove('on'); li.classList.remove('skipped');
        } else {
          state.skipped.push(n);
          state.visited = state.visited.filter(function (v) { return v.name !== n; });
          this.classList.add('on'); li.classList.add('skipped'); li.classList.remove('went');
          row.querySelector('.went').classList.remove('on');
        }
        save(); draw(); fork();
      };
    });
  }

  function renderActual() {
    var log = document.getElementById('log');
    var note = document.querySelector('.daynote');
    note.textContent = 'Only what actually happened, in the order you logged it. Solid line on the map.';
    if (!state.visited.length) {
      log.innerHTML = '<p class="empty">Nothing logged yet. Open a day, tap \u201c\u2713 Went\u201d on ' +
        'what you did, and it shows up here.</p>';
      return;
    }
    var sorted = state.visited.slice().sort(function (a, b) { return a.t - b.t; });
    log.innerHTML = sorted.map(function (v, i) {
      var when = new Date(v.t);
      var hr = when.getHours(), ap = hr >= 12 ? 'PM' : 'AM';
      var time = (hr % 12 || 12) + ':' + ('0' + when.getMinutes()).slice(-2) + ' ' + ap;
      var prev = i ? mi(sorted[i - 1].lat, sorted[i - 1].lng, v.lat, v.lng) : 0;
      return '<li class="stop went"><span class="time">' + time + '</span>' +
        '<span class="knot">' + (i + 1) + '</span>' +
        '<div class="card" style="cursor:default"><p class="name">' + v.name + '</p>' +
        '<p class="what">' + (v.custom ? 'Added by you' : window.TRIP.days[v.di] ?
          window.TRIP.days[v.di].label : '') + '</p><span class="chips">' +
        (i ? '<span class="chip walk">' + prev.toFixed(1) + ' mi \u00b7 ' + walkMin(prev) +
          ' min from last</span>' : '<span class="chip">Started here</span>') +
        '</span><div class="logrow"><button class="undo" data-n="' +
        v.name.replace(/"/g, '&quot;') + '">Remove</button></div></div></li>';
    }).join('');
    log.querySelectorAll('.undo').forEach(function (b) {
      b.onclick = function () {
        state.visited = state.visited.filter(function (v) { return v.name !== b.dataset.n; });
        save(); renderActual(); draw(); fork();
      };
    });
  }

  function init() {
    if (!window.TRIP || !window.TRIP_MAP) { setTimeout(init, 120); return; }
    var days = document.getElementById('days');

    var tab = document.createElement('button');
    tab.className = 'day-btn actual-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.dataset.v = 'actual';
    tab.textContent = 'Where we went';
    days.appendChild(tab);

    var key = document.createElement('p');
    key.className = 'daykey';
    key.innerHTML = window.TRIP.days.map(function (d, i) {
      return '<span><i style="border-color:' + COLORS[i % 3] + '"></i>' + d.label + '</span>';
    }).join('') + '<span>dashed = planned \u00b7 solid = went</span>';
    var map = document.getElementById('map');
    map.parentNode.insertBefore(key, map.nextSibling);

    var fb = document.createElement('div');
    fb.id = 'forkbox';
    var note = document.querySelector('.daynote');
    note.parentNode.insertBefore(fb, note);

    days.addEventListener('click', function (e) {
      var b = e.target.closest('.day-btn');
      if (!b) return;
      if (b.dataset.v === 'actual') {
        e.stopPropagation();
        [].forEach.call(days.querySelectorAll('.day-btn'), function (x) {
          x.setAttribute('aria-selected', 'false');
        });
        b.setAttribute('aria-selected', 'true');
        actual = true; renderActual(); draw(); fork();
      } else {
        actual = false;
        tab.setAttribute('aria-selected', 'false');
      }
    }, true);

    var geo = document.getElementById('geo-btn');
    if (geo) geo.addEventListener('click', function () {
      setTimeout(function () {
        navigator.geolocation.getCurrentPosition(function (p) {
          here = { lat: p.coords.latitude, lng: p.coords.longitude }; fork();
        }, function () {}, { timeout: 9000, maximumAge: 60000 });
      }, 300);
    });

    new MutationObserver(function () { if (!actual) { decorate(); draw(); } })
      .observe(document.getElementById('log'), { childList: true });

    decorate(); draw(); fork();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 60); });
  } else setTimeout(init, 60);
})();
