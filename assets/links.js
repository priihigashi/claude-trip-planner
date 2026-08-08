/* Real Google Business links.
 *
 * Every place we store carries a Google place_id. Until now those became a
 * Maps *search*, and "Photos" was a Google Images search \u2014 which returns
 * whatever the web has, not the business's own pictures.
 *
 * This rewrites them to the proper endpoints:
 *   profile  https://www.google.com/maps/place/?q=place_id:XXX
 *   photos   https://search.google.com/local/photos?placeid=XXX
 *   reviews  https://search.google.com/local/reviews?placeid=XXX
 *
 * Photos and reviews are the business's own Google listing \u2014 the pictures
 * customers and the owner uploaded, and the full review feed.
 */
(function () {
  function pidOf(href) {
    var m = /query_place_id=([^&]+)/.exec(href || '');
    return m ? decodeURIComponent(m[1]) : null;
  }
  var PLACE = function (p) { return 'https://www.google.com/maps/place/?q=place_id:' + p; };
  var PHOTOS = function (p) { return 'https://search.google.com/local/photos?placeid=' + p; };
  var REVIEWS = function (p) { return 'https://search.google.com/local/reviews?placeid=' + p; };

  function upgradeAll() {
    document.querySelectorAll('a[href*="query_place_id="]').forEach(function (a) {
      if (a.dataset.gb) return;
      var p = pidOf(a.getAttribute('href'));
      if (!p) return;
      a.dataset.gb = p;
      a.href = PLACE(p);
    });
  }

  function fixSheet() {
    var box = document.getElementById('s-btns');
    if (!box) return;
    var links = box.querySelectorAll('a');
    if (!links.length) return;

    var pid = null;
    links.forEach(function (a) {
      var p = pidOf(a.getAttribute('href')) || a.dataset.gb;
      if (p) pid = p;
    });
    if (!pid || box.dataset.pid === pid) return;
    box.dataset.pid = pid;

    var phone = null;
    links.forEach(function (a) {
      if ((a.getAttribute('href') || '').indexOf('tel:') === 0) phone = a.getAttribute('href');
    });

    var html = '<a class="btn" target="_blank" rel="noopener" href="' + PLACE(pid) + '">Open in Maps</a>' +
      '<a class="btn ghost" target="_blank" rel="noopener" href="' + PHOTOS(pid) + '">Photos</a>' +
      '<a class="btn ghost" target="_blank" rel="noopener" href="' + REVIEWS(pid) + '">Reviews</a>';
    if (phone) html += '<a class="btn ghost" href="' + phone + '">Call</a>';
    box.innerHTML = html;
  }

  function tick() { upgradeAll(); fixSheet(); }

  new MutationObserver(function () { setTimeout(tick, 40); })
    .observe(document.body, { childList: true, subtree: true });
  setTimeout(tick, 500);
})();
