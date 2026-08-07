/* Rain mode.
 *
 * "It is raining \u2014 where now?" Takes your location, ranks everything indoor
 * by how far you would have to walk in the wet, and warns you off the open-air
 * places. Auto-opens if the live forecast says it is actually raining.
 *
 * Indoor list = itinerary stops flagged below + extra bolt-holes that are not
 * on the plan but are useful when you are caught out.
 */
(function () {
  var INDOOR = {
    'Pirate & Treasure Museum': 1, 'Pirate &amp; Treasure Museum': 1,
    'Oldest Wooden Schoolhouse': 1, 'Columbia Restaurant': 1, "Pizzalley's": 1,
    'Crucial Coffee': 1, 'Kilwins': 1, 'The Hyppo': 1, 'Casa Maya': 1,
    "Harry's Seafood": 1, 'Maple Street Biscuit Co.': 1, "Georgie's Diner": 1,
    'The Blue Hen Caf\u00e9': 1, 'Harbor View Caf\u00e9': 1, 'Villa Zorayda Museum': 1,
    'Alligator Farm': 0, 'St. Augustine Lighthouse': 0
  };
  var OUTDOOR = ['Colonial Quarter', 'Castillo', 'Project Swing', 'Aviles', 'St. George Street walk',
    'Plaza', 'Seawall', 'Black Raven', 'Fountain of Youth'];

  var EXTRA = [
    { name: 'Lightner Museum', what: 'Three floors of Gilded Age collections in an old hotel. Kids under 12 free.',
      hours: '9:00 AM \u2013 5:00 PM', lat: 29.8909482, lng: -81.3136432,
      q: 'Lightner Museum St Augustine', pid: 'ChIJM47eEpQn5IgRsxOMPGD46qE' },
    { name: 'Villa Zorayda Museum', what: 'Moorish palace, self-guided audio tour, about an hour.',
      hours: '10:00 AM \u2013 5:00 PM', lat: 29.89158, lng: -81.315131,
      q: 'Villa Zorayda Museum St Augustine', pid: 'ChIJ8WFxX5Qn5IgRGlZQmbqM4qM' },
    { name: 'St. George Street shops', what: 'Awnings the whole way and every shop is air-conditioned. Free.',
      hours: 'Most shops until 8 or 9', lat: 29.8962, lng: -81.3133,
      q: 'St George Street St Augustine' },
    { name: 'Flagler College lobby', what: 'Free, indoors, Tiffany windows, five minutes.',
      hours: 'Daytime', lat: 29.8909, lng: -81.3145, q: 'Flagler College St Augustine' },
    { name: 'Whetstone Chocolates', what: 'Factory tour and tasting. Entirely indoors, ends in chocolate.',
      hours: 'Check same day', lat: 29.8912, lng: -81.3243, q: 'Whetstone Chocolates St Augustine' }
  ];

  function mi(a, b, c, d) {
    var R = 3958.8, r = function (x) { return x * Math.PI / 180; };
    var u = r(c - a), v = r(d - b);
    var q = Math.pow(Math.sin(u / 2), 2) + Math.cos(r(a)) * Math.cos(r(c)) * Math.pow(Math.sin(v / 2), 2);
    return R * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
  }
  function strip(s) { var e = document.createElement('div'); e.innerHTML = s; return e.textContent; }
  function isOutdoor(n) {
    for (var i = 0; i < OUTDOOR.length; i++) if (n.indexOf(OUTDOOR[i]) > -1) return true;
    return false;
  }

  function candidates() {
    var out = EXTRA.slice();
    if (window.TRIP) window.TRIP.days.forEach(function (d) {
      d.stops.forEach(function (s) {
        var n = strip(s.name);
        if (!s.lat || isOutdoor(n) || INDOOR[n] === 0) return;
        if (!INDOOR[n] && !INDOOR[s.name]) return;
        if (out.some(function (x) { return x.name === n; })) return;
        out.push({ name: n, what: s.what, hours: s.hours, lat: s.lat, lng: s.lng, q: s.q, pid: s.pid });
      });
    });
    return out;
  }

  function show(pos) {
    var box = document.getElementById('rainbox');
    var list = candidates().map(function (c) {
      c.d = mi(pos.lat, pos.lng, c.lat, c.lng); return c;
    }).sort(function (a, b) { return a.d - b.d; }).slice(0, 4);

    box.innerHTML = '<div class="rainbox"><h3>Raining \u2014 nearest cover</h3>' +
      '<p class="lead">Ranked by how far you have to walk in the wet. ' +
      'Afternoon storms here usually pass in 30\u201360 minutes.</p>' +
      list.map(function (c) {
        var url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.q) +
          (c.pid ? '&query_place_id=' + c.pid : '');
        return '<a target="_blank" rel="noopener" href="' + url + '">' +
          '<p class="rn">' + c.name + '</p><p class="rw">' + (c.what || '') + '</p>' +
          '<span class="rm">' + (c.d < .19 ? Math.round(c.d * 5280) + ' ft' : c.d.toFixed(1) + ' mi') +
          ' \u00b7 ' + Math.max(1, Math.round(c.d * 20)) + ' min walk' +
          (c.hours ? ' \u00b7 ' + c.hours : '') + '</span></a>';
      }).join('') +
      '<p class="lead out" style="margin:12px 0 0">Skip while it rains: Colonial Quarter, ' +
      'the fort courtyard, the playground and the pirate ship are all open-air.</p></div>';
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function ask() {
    var box = document.getElementById('rainbox');
    box.innerHTML = '<div class="rainbox"><p class="lead">Finding you\u2026</p></div>';
    if (!navigator.geolocation) { show({ lat: 29.8955, lng: -81.3135 }); return; }
    navigator.geolocation.getCurrentPosition(
      function (p) { show({ lat: p.coords.latitude, lng: p.coords.longitude }); },
      function () { show({ lat: 29.8955, lng: -81.3135 }); },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 120000 });
  }

  function init() {
    var geo = document.querySelector('.geo');
    if (!geo) { setTimeout(init, 150); return; }
    var b = document.createElement('button');
    b.className = 'rainbtn';
    b.id = 'rain-btn';
    b.textContent = '\u2614 It is raining \u2014 where now?';
    geo.parentNode.insertBefore(b, geo.nextSibling);
    var box = document.createElement('div');
    box.id = 'rainbox';
    b.parentNode.insertBefore(box, b.nextSibling);
    b.onclick = ask;

    if (window.TRIP) {
      fetch('https://api.open-meteo.com/v1/forecast?latitude=' + window.TRIP.lat +
        '&longitude=' + window.TRIP.lng + '&current=precipitation&timezone=auto')
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j.current && j.current.precipitation > 0) {
            b.classList.add('hot');
            b.textContent = '\u2614 It is raining right now \u2014 tap for cover';
          }
        }).catch(function () {});
    }
  }
  setTimeout(init, 200);
})();
