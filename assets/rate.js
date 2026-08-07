/* Ratings and notes for stops you logged.
 * Shares the same localStorage record as log.js. Stays on the device.
 */
(function () {
  var KEY = 'trip-log:' + location.pathname;
  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { visited: [], skipped: [] }; }
    catch (e) { return { visited: [], skipped: [] }; }
  }
  function write(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function strip(s) { var e = document.createElement('div'); e.innerHTML = s; return e.textContent; }
  function entry(name) {
    var s = read();
    for (var i = 0; i < s.visited.length; i++) if (s.visited[i].name === name) return s.visited[i];
    return null;
  }
  function patch(name, field, value) {
    var s = read();
    s.visited.forEach(function (v) { if (v.name === name) v[field] = value; });
    write(s);
  }

  function isActual() {
    var t = document.querySelector('.actual-tab');
    return t && t.getAttribute('aria-selected') === 'true';
  }

  function build(name) {
    var e = entry(name) || {};
    var wrap = document.createElement('div');
    wrap.className = 'rate';
    var stars = '';
    for (var i = 1; i <= 5; i++) {
      stars += '<button data-v="' + i + '"' + (e.rating >= i ? ' class="on"' : '') +
        ' aria-label="' + i + ' stars">\u2605</button>';
    }
    wrap.innerHTML = '<p class="rate-h">Your rating</p><div class="stars-in">' + stars + '</div>' +
      '<textarea placeholder="What was good, what to order differently next time\u2026">' +
      (e.note || '') + '</textarea><p class="saved"></p>';

    var msg = wrap.querySelector('.saved');
    wrap.querySelectorAll('.stars-in button').forEach(function (b) {
      b.onclick = function (ev) {
        ev.stopPropagation();
        var v = +b.dataset.v;
        var cur = entry(name);
        if (cur && cur.rating === v) v = 0;
        patch(name, 'rating', v);
        wrap.querySelectorAll('.stars-in button').forEach(function (x) {
          x.classList.toggle('on', +x.dataset.v <= v);
        });
        msg.textContent = v ? 'Saved \u00b7 ' + v + ' stars' : 'Rating cleared';
      };
    });
    var ta = wrap.querySelector('textarea');
    ta.onclick = function (ev) { ev.stopPropagation(); };
    var timer;
    ta.oninput = function () {
      clearTimeout(timer);
      timer = setTimeout(function () { patch(name, 'note', ta.value); msg.textContent = 'Saved'; }, 500);
    };
    return wrap;
  }

  function sync() {
    var s = read();
    document.querySelectorAll('#log .stop').forEach(function (li) {
      var nameEl = li.querySelector('.name');
      if (!nameEl) return;
      var name = strip(nameEl.innerHTML);
      var e = null;
      for (var i = 0; i < s.visited.length; i++) if (s.visited[i].name === name) e = s.visited[i];

      if (isActual()) {
        if (!li.querySelector('.rate')) li.querySelector('.card').appendChild(build(name));
      } else if (e && e.rating) {
        var chips = li.querySelector('.chips');
        if (chips && !chips.querySelector('.rated')) {
          var c = document.createElement('span');
          c.className = 'chip rated';
          c.textContent = 'You: ' + e.rating + ' \u2605';
          chips.appendChild(c);
        }
      }
    });
  }

  function start() {
    var log = document.getElementById('log');
    if (!log) { setTimeout(start, 150); return; }
    new MutationObserver(function () { setTimeout(sync, 30); })
      .observe(log, { childList: true });
    var days = document.getElementById('days');
    if (days) days.addEventListener('click', function () { setTimeout(sync, 120); });
    sync();
  }
  setTimeout(start, 200);
})();
