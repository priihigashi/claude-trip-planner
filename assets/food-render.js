/* Food Intelligence renderer.
 * Watches the detail sheet and injects the food card whenever a stop whose
 * name matches a key in window.FOOD is opened. Kept separate from trip.js so
 * the core engine stays small and trips without food data are unaffected.
 */
(function () {
  var host = document.getElementById('s-food');
  var nameEl = document.getElementById('s-name');
  if (!host || !nameEl || !window.FOOD) return;

  function esc(s) { return String(s).replace(/&(?!amp;)/g, '&amp;'); }

  function build(f) {
    var h = '<div class="food-box"><p class="food-h">What to order</p>';
    (f.roles || []).forEach(function (r) {
      h += '<div class="food-role"><b>' + esc(r.r) + '</b><span>' + esc(r.v) + '</span></div>';
    });
    if (f.signature) h += '<p class="food-line"><em>Reviewers keep mentioning</em>' + esc(f.signature) + '</p>';
    if (f.avoid) h += '<p class="food-line warn"><em>Skip</em>' + esc(f.avoid) + '</p>';
    if (f.kidNote) h += '<p class="food-line"><em>With kids</em>' + esc(f.kidNote) + '</p>';
    if (f.note) h += '<p class="food-line warn"><em>Note</em>' + esc(f.note) + '</p>';
    var meta = '';
    if (f.wait) meta += '<span>Wait: ' + esc(f.wait) + '</span>';
    if (f.coffee) meta += '<span>Coffee: ' + esc(f.coffee) + '</span>';
    if (f.parking) meta += '<span>Parking: ' + esc(f.parking) + '</span>';
    if (meta) h += '<div class="food-meta">' + meta + '</div>';
    h += '</div>';
    if (f.verdict) h += '<p class="verdict"><em>Our verdict</em>' + esc(f.verdict) + '</p>';
    return h;
  }

  function sync() {
    var key = nameEl.textContent.trim();
    var f = window.FOOD[key];
    if (!f) {
      for (var k in window.FOOD) {
        if (k.replace(/[^a-z]/gi, '').toLowerCase() === key.replace(/[^a-z]/gi, '').toLowerCase()) { f = window.FOOD[k]; break; }
      }
    }
    host.innerHTML = f ? build(f) : '';
  }

  new MutationObserver(sync).observe(nameEl, { childList: true, characterData: true, subtree: true });
  sync();
})();
