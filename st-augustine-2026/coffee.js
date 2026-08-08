/* Quick breakfast option, and the timing shift that follows from it.
 *
 * Sat 8 Aug: bagel and cake at the hotel Starbucks before leaving, so the
 * 11:00 brunch became a 12:30 lunch instead. Keeping the light-breakfast route
 * on file because it is the pattern that actually works on a trolley morning.
 * Load after playground.js.
 */
(function () {
  if (!window.TRIP) return;

  var coffee = {
    t: '8:30', opt: 1, tags: ['food', 'coffee'], name: 'Quick coffee + pastry',
    type: 'Light start \u00b7 buys you a later meal',
    what: 'Bagel and coffee before you go, so brunch can become lunch.',
    blurb: 'The hotel restaurant, Castillo Craft Bar + Kitchen, serves breakfast 7\u201310:30. ' +
      'Starbucks at 95 Cordova St runs 6 AM\u20139 PM daily if you want it earlier or later \u2014 ' +
      'outdoor tables facing the historic buildings. Either way a light start pushes the real ' +
      'meal to 12:30, which fits a morning on the trolley far better than eating at 11.',
    hours: 'Hotel 7:00\u201310:30 AM \u00b7 Starbucks 6 AM\u20139 PM', price: '$',
    rating: '4.2', count: '365', addr: '95 Cordova St, or the hotel restaurant',
    phone: '9048196812', q: 'Starbucks Cordova St St Augustine',
    pid: 'ChIJqe22U40n5IgR-Ycrw24r3KI', lat: 29.8920926, lng: -81.313813,
    walk: 'In the hotel, or 6-min walk', dur: '25 min'
  };

  function shift(list) {
    if (list.some(function (s) { return s.name.indexOf('Quick coffee') > -1; })) return list;
    var out = [coffee];
    list.forEach(function (s) {
      if (s.name.indexOf('Roosevelt') > -1) {
        var b = Object.create(s);
        b.t = '12:30';
        b.type = 'Lunch \u00b7 eggs and cocktails';
        b.blurb = 'Kitchen runs until 2, so a light breakfast makes 12:30 the better slot \u2014 no ' +
          'rushing off the trolley and no eating when nobody is hungry. ' + s.blurb;
        out.push(b);
      } else out.push(s);
    });
    return out;
  }

  if (window.SAT_VARIANTS) {
    Object.keys(window.SAT_VARIANTS).forEach(function (k) {
      window.SAT_VARIANTS[k].stops = shift(window.SAT_VARIANTS[k].stops);
    });
  }
  if (window.TRIP.days[1]) window.TRIP.days[1].stops = shift(window.TRIP.days[1].stops);
})();
