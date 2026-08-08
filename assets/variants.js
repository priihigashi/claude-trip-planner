/* Renders a Walking day / Trolley day switch when Saturday is selected. */
(function () {
  function init() {
    var days = document.getElementById('days');
    if (!days || !window.SAT_VARIANTS || !window.TRIP) { setTimeout(init, 180); return; }

    var bar = document.createElement('div');
    bar.className = 'variants';
    bar.style.display = 'none';
    bar.innerHTML = Object.keys(window.SAT_VARIANTS).map(function (k, i) {
      return '<button data-v="' + k + '" aria-pressed="' + (i === 0) + '">' +
        window.SAT_VARIANTS[k].label + '</button>';
    }).join('');
    var map = document.getElementById('map');
    map.parentNode.insertBefore(bar, map);

    function satActive() {
      var b = document.querySelector('.day-btn[aria-selected="true"]');
      if (!b) return false;
      var all = [].slice.call(document.querySelectorAll('.day-btn'));
      return all.indexOf(b) === 1;
    }
    function sync() { bar.style.display = satActive() ? 'flex' : 'none'; }

    days.addEventListener('click', function () { setTimeout(sync, 60); });
    setTimeout(sync, 300);

    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      bar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      var v = window.SAT_VARIANTS[b.dataset.v];
      window.TRIP.days[1].stops = v.stops;
      window.TRIP.days[1].note = v.note;
      var satTab = document.querySelectorAll('.day-btn')[1];
      if (satTab) satTab.click();
      setTimeout(sync, 80);
    });
  }
  setTimeout(init, 360);
})();
