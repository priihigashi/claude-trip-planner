/* Trolley view \u2014 fifth tab.
 * Draws the 22-stop loop in orange and lists every stop with a tip.
 * Independent of the day tabs; loaded after trip.js.
 */
(function () {
  if (!window.TROLLEY) return;
  var layer = null, on = false;

  function init() {
    if (!window.TRIP_MAP || !document.getElementById('days')) { setTimeout(init, 150); return; }
    var days = document.getElementById('days');

    var tab = document.createElement('button');
    tab.className = 'day-btn trolley-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.dataset.v = 'trolley';
    tab.textContent = 'Trolley';
    days.appendChild(tab);

    days.addEventListener('click', function (e) {
      var b = e.target.closest('.day-btn');
      if (!b) return;
      if (b.dataset.v === 'trolley') {
        e.stopPropagation();
        [].forEach.call(days.querySelectorAll('.day-btn'), function (x) {
          x.setAttribute('aria-selected', 'false');
        });
        b.setAttribute('aria-selected', 'true');
        on = true; render(); draw();
      } else {
        on = false;
        tab.setAttribute('aria-selected', 'false');
        if (layer) layer.clearLayers();
      }
    }, true);
  }

  function draw() {
    var map = window.TRIP_MAP;
    if (!map) return;
    if (!layer) layer = L.layerGroup().addTo(map);
    layer.clearLayers();
    if (!on) return;

    var pts = window.TROLLEY.stops.map(function (s) { return [s.lat, s.lng]; });
    pts.push(pts[0]);
    L.polyline(pts, { color: '#D4622A', weight: 3.5, opacity: .85, lineCap: 'round' }).addTo(layer);
    window.TROLLEY.stops.forEach(function (s) {
      L.marker([s.lat, s.lng], {
        icon: L.divIcon({
          html: '<div class="pin" style="background:#D4622A;border-color:#7A3010;color:#fff">' +
            s.n + '</div>', className: '', iconSize: [26, 26], iconAnchor: [13, 13]
        }), title: s.name
      }).addTo(layer).bindPopup('<b>' + s.name + '</b><br>' + s.what);
    });
    map.fitBounds(pts, { padding: [40, 40] });
  }

  function render() {
    var note = document.querySelector('.daynote');
    var log = document.getElementById('log');
    note.textContent = '';
    log.innerHTML = '<div class="trolhead"><h3>' + window.TROLLEY.name + '</h3><p>' +
      window.TROLLEY.note + '</p></div>' +
      window.TROLLEY.stops.map(function (s) {
        var q = 'https://www.google.com/maps/search/?api=1&query=' +
          encodeURIComponent(s.name + ' St Augustine');
        return '<li class="stop trol"><span class="time">Stop</span>' +
          '<span class="knot">' + s.n + '</span>' +
          '<a class="card" style="text-decoration:none" target="_blank" rel="noopener" href="' + q + '">' +
          '<p class="name">' + s.name + '</p>' +
          '<p class="what">' + s.what + '</p>' +
          (s.perks ? '<span class="chips"><span class="chip perk">' + s.perks + '</span></span>' : '') +
          '<p class="tip">' + s.tip + '</p></a></li>';
      }).join('');
    setTimeout(function () {
      log.querySelectorAll('.logrow').forEach(function (r) { r.remove(); });
    }, 60);
  }

  setTimeout(init, 120);
})();
