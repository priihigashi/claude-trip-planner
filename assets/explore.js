/* Explore All view \u2014 sixth tab.
 * Everything in the city, on the plan or not, so the route is a choice rather
 * than the only thing you can see.
 */
(function () {
  if (!window.EXPLORE) return;
  var layer = null, on = false, cat = 'All';

  function cats() {
    var set = {};
    window.EXPLORE.forEach(function (e) { e.c.split(' \u00b7 ').forEach(function (c) { set[c] = 1; }); });
    return ['All'].concat(Object.keys(set).sort());
  }
  function list() {
    return window.EXPLORE.filter(function (e) { return cat === 'All' || e.c.indexOf(cat) > -1; });
  }

  function draw() {
    var map = window.TRIP_MAP;
    if (!map) return;
    if (!layer) layer = L.layerGroup().addTo(map);
    layer.clearLayers();
    if (!on) return;
    var pts = [];
    list().forEach(function (e) {
      L.marker([e.lat, e.lng], {
        icon: L.divIcon({ html: '<div class="pin exp">\u25c6</div>', className: '',
          iconSize: [22, 22], iconAnchor: [11, 11] }), title: e.n
      }).addTo(layer).bindPopup('<b>' + e.n + '</b><br>' + e.w);
      pts.push([e.lat, e.lng]);
    });
    if (pts.length) map.fitBounds(pts, { padding: [40, 40] });
  }

  function render() {
    var note = document.querySelector('.daynote');
    var log = document.getElementById('log');
    note.textContent = '';
    log.innerHTML = '<div class="exphead"><h3>Explore all</h3>' +
      '<p>Everything worth knowing about, on the plan or not. Use it to decide against things ' +
      'as much as for them.</p><div class="expcats">' +
      cats().map(function (c) {
        return '<button data-c="' + c + '" aria-pressed="' + (c === cat) + '">' + c + '</button>';
      }).join('') + '</div></div>' +
      list().map(function (e) {
        var url = e.pid ? 'https://www.google.com/maps/place/?q=place_id:' + e.pid
          : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(e.q);
        return '<li class="stop exps"><span class="time"></span><span class="knot">\u25c6</span>' +
          '<a class="card" style="text-decoration:none" target="_blank" rel="noopener" href="' + url + '">' +
          '<p class="name">' + e.n + '</p><p class="what">' + e.w + '</p>' +
          '<span class="chips"><span class="chip">' + e.c + '</span></span></a></li>';
      }).join('');
    log.querySelector('.expcats').addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      cat = b.dataset.c; render(); draw();
    });
    setTimeout(function () {
      log.querySelectorAll('.logrow').forEach(function (r) { r.remove(); });
    }, 60);
  }

  function init() {
    var days = document.getElementById('days');
    if (!days || !window.TRIP_MAP) { setTimeout(init, 170); return; }
    var tab = document.createElement('button');
    tab.className = 'day-btn explore-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.dataset.v = 'explore';
    tab.textContent = 'Explore all';
    days.appendChild(tab);

    days.addEventListener('click', function (e) {
      var b = e.target.closest('.day-btn');
      if (!b) return;
      if (b.dataset.v === 'explore') {
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
  setTimeout(init, 150);
})();
