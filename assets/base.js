/* Home base pin, drawn on every view.
 *
 * Its own Leaflet layer, added once and never cleared by the day/trolley/actual
 * renderers, so the hotel is always on the map as a reference point.
 * Reads window.BASE \u2014 change the trip's base by editing that file alone.
 */
(function () {
  function init() {
    if (!window.BASE || !window.TRIP_MAP) { setTimeout(init, 160); return; }
    var map = window.TRIP_MAP, B = window.BASE;
    var layer = L.layerGroup().addTo(map);

    var url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(B.q) +
      (B.pid ? '&query_place_id=' + B.pid : '');

    L.marker([B.lat, B.lng], {
      icon: L.divIcon({ html: '<div class="basepin">\u2302</div>', className: '',
        iconSize: [24, 24], iconAnchor: [12, 12] }), zIndexOffset: 900
    }).addTo(layer).bindPopup('<b>' + B.name + '</b><br>' + B.addr +
      '<br><a href="' + url + '" target="_blank" rel="noopener">Directions</a>');

    L.marker([B.lat - 0.00042, B.lng], {
      icon: L.divIcon({ html: '<span class="baselabel">' + (B.label || 'Base') + '</span>',
        className: '', iconSize: [54, 14], iconAnchor: [27, 0] }), interactive: false
    }).addTo(layer);

    /* keep it on top after any other layer redraws */
    map.on('overlayadd zoomend moveend', function () { layer.eachLayer(function (l) { l.bringToFront && l.bringToFront(); }); });

    var lg = document.querySelector('.maplegend');
    if (lg && !lg.querySelector('.baseleg')) {
      var s = document.createElement('span');
      s.className = 'baseleg';
      s.innerHTML = '<i style="background:#F2EDE3;border:1px solid #0E1F2E"></i>' + (B.label || 'Base');
      lg.appendChild(s);
    }
  }
  setTimeout(init, 300);
})();
