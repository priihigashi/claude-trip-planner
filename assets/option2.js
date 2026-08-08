/* Renders the Option 2 block inside the place card.
 * Reads window.OPTION2, keyed by stop name.
 */
(function () {
  var nameEl = document.getElementById('s-name');
  var host = document.getElementById('s-alts');
  if (!nameEl || !host || !window.OPTION2) return;

  function strip(s) { var e = document.createElement('div'); e.innerHTML = s; return e.textContent; }

  function find(key) {
    if (window.OPTION2[key]) return window.OPTION2[key];
    for (var k in window.OPTION2) {
      if (strip(k).replace(/[^a-z]/gi, '').toLowerCase() ===
          key.replace(/[^a-z]/gi, '').toLowerCase()) return window.OPTION2[k];
    }
    return null;
  }

  function render() {
    var old = document.getElementById('opt2-box');
    if (old) old.remove();
    var o = find(nameEl.textContent.trim());
    if (!o) return;

    var url = o.alt.pid
      ? 'https://www.google.com/maps/place/?q=place_id:' + o.alt.pid
      : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(o.alt.q);

    var box = document.createElement('div');
    box.id = 'opt2-box';
    box.innerHTML = '<div class="opt2"><p class="h">Option 2 \u00b7 casual and cheaper</p>' +
      (o.dress ? '<p class="dress"><em>What to wear</em>' + o.dress + '</p>' : '') +
      '<a target="_blank" rel="noopener" href="' + url + '">' +
      '<p class="n">' + o.alt.name + '</p>' +
      '<p class="w">' + o.alt.why + '</p>' +
      '<span class="m">' + o.alt.meta + '</span></a></div>';
    host.parentNode.insertBefore(box, host);
  }

  new MutationObserver(function () { setTimeout(render, 30); })
    .observe(nameEl, { childList: true, characterData: true, subtree: true });
  setTimeout(render, 500);
})();
