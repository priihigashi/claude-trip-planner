/* You Are Here.
 *
 * Modelled on the City of St. Augustine directory boards: a labelled marker
 * rather than a bare dot, plus the dashed five-minute-walk ring (a quarter
 * mile) those boards draw around your position.
 *
 * Uses watchPosition, so the marker follows you as you walk. Location is only
 * ever read in the browser \u2014 never stored or sent anywhere.
 */
(function () {
  var layer = null, watchId = null, ring = null, marker = null, acc = null;

  function paint(p) {
    var map = window.TRIP_MAP;
    if (!map) return;
    if (!layer) layer = L.layerGroup().addTo(map);
    layer.clearLayers();

    var ll = [p.lat, p.lng];

    if (p.accuracy && p.accuracy > 25) {
      acc = L.circle(ll, { radius: p.accuracy, color: '#B8332B', weight: 1,
        opacity: .35, fillColor: '#B8332B', fillOpacity: .07 }).addTo(layer);
    }

    ring = L.circle(ll, { radius: 402, color: '#2E9179', weight: 1.5, dashArray: '5 7',
      opacity: .75, fill: false }).addTo(layer);
    L.marker([p.lat + 0.0036, p.lng], {
      icon: L.divIcon({ html: '<span class="ringlabel">5-minute walk</span>',
        className: '', iconSize: [90, 16], iconAnchor: [45, 8] }),
      interactive: false
    }).addTo(layer);

    marker = L.marker(ll, {
      icon: L.divIcon({
        html: '<div class="yah"><span class="flag">YOU ARE HERE</span><span class="dot"></span></div>',
        className: '', iconSize: [0, 0], iconAnchor: [0, 0]
      }), zIndexOffset: 1000, interactive: false
    }).addTo(layer);

    if (!paint.centred) { map.setView(ll, 16); paint.centred = true; }
  }

  function start() {
    if (watchId !== null || !navigator.geolocation) return;
    watchId = navigator.geolocation.watchPosition(function (p) {
      paint({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy });
    }, function () {}, { enableHighAccuracy: true, maximumAge: 15000, timeout: 12000 });
  }

  function init() {
    if (!window.TRIP_MAP) { setTimeout(init, 150); return; }
    ['geo-btn', 'ab-loc', 'ab-near', 'rain-btn'].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.addEventListener('click', start);
    });
    var mo = new MutationObserver(function () {
      var b = document.getElementById('ab-loc');
      if (b && !b.__yah) { b.__yah = 1; b.addEventListener('click', start); }
    });
    mo.observe(document.body, { childList: true });
  }
  setTimeout(init, 300);
})();
