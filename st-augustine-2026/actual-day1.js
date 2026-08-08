/* What actually happened on Friday 7 Aug 2026, plus corrections to the plan
 * based on being there.
 *
 * Seeds the visit log once. Guarded by a flag, so anything deleted in the app
 * stays deleted and this never re-adds it.
 */
(function () {
  /* ---- corrections from the ground ---- */
  if (window.TRIP) {
    window.TRIP.days.forEach(function (d) {
      d.stops.forEach(function (s) {
        if (s.name.indexOf('Castillo') > -1) {
          s.price = '$15 per adult \u00b7 $30 for two \u00b7 15 and under FREE \u00b7 pass good 7 days';
          s.blurb = 'Confirmed on site: $15 each for the adults, $30 for the two of us, kids free. ' +
            'Clean restrooms and water fountains inside, a small indoor room where kids can play, ' +
            'and the grounds outside are the best part \u2014 sand, sticks, rocks to climb, and room ' +
            'to run. Easily fills a whole afternoon; we stayed until closing.';
          s.dur = '2\u20133 hr (we stayed until close)';
        }
      });
    });
  }

  /* ---- the actual log ---- */
  var KEY = 'trip-log:' + location.pathname;
  var FLAG = 'trip-seed-day1:' + location.pathname;
  try {
    if (localStorage.getItem(FLAG)) return;

    var D = function (h, m) { return new Date(2026, 7, 7, h, m).getTime(); };
    var seed = [
      { name: 'Hotel check-in (early)', lat: 29.8997022, lng: -81.3155722, di: 0, t: D(13, 0),
        custom: 1, note: 'They let us in early. Parked across the street instead of valet \u2014 $20 ' +
          'one time, not per entry, so the car can stay put all weekend.' },
      { name: 'St. George Street walk', lat: 29.8962, lng: -81.3133, di: 0, t: D(13, 30),
        note: 'Walked from the top, did not go far before turning around. Shaded, easy with kids.' },
      { name: 'Castillo de San Marcos', lat: 29.8978618, lng: -81.3115187, di: 0, t: D(14, 30),
        rating: 5, note: '$15 per adult, $30 for the two of us, kids free. Stayed until it closed. ' +
          'Clean bathrooms and water fountains, a small room where the kids could play, and the ' +
          'outdoor area is beautiful \u2014 they played with sand and sticks and climbed the rocks. ' +
          'Best value of the trip.' },
      { name: "Pizzalley's", lat: 29.8942136, lng: -81.3127829, di: 0, t: D(18, 30),
        rating: 5, note: 'Great. Ricotta, pepperoni and hot honey pizza, plus lasagna. Kids shared ' +
          'a cheese pizza and spaghetti, $10 each.' },
      { name: 'The Sweet Spot (ice cream)', lat: 29.8966884, lng: -81.3134052, di: 0, t: D(19, 45),
        custom: 1, rating: 3, note: 'Just OK. Kilwins or Ben & Jerry\u2019s would have been the better ' +
          'call. Note most museums are shut by this hour \u2014 evening is shops only.' },
      { name: 'Back at the hotel', lat: 29.8997022, lng: -81.3155722, di: 0, t: D(20, 0),
        custom: 1, note: 'In around 8. Great shower, everyone rested.' }
    ];

    var st = JSON.parse(localStorage.getItem(KEY)) || { visited: [], skipped: [] };
    seed.forEach(function (s) {
      if (!st.visited.some(function (v) { return v.name === s.name; })) st.visited.push(s);
    });
    ['Georgie\u2019s Diner', "Georgie's Diner", 'Old Town Trolley', 'King St castles \u2014 Villa Zorayda & Flagler']
      .forEach(function (n) { if (st.skipped.indexOf(n) < 0) st.skipped.push(n); });

    localStorage.setItem(KEY, JSON.stringify(st));
    localStorage.setItem(FLAG, '1');
  } catch (e) {}
})();
