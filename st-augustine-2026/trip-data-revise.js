/* Revision, 7 Aug afternoon.
 * Breakfast happened at Blue Hen, bags are at the hotel, and the call was made
 * to walk the city first rather than ride the trolley. Trolley moves to Saturday.
 * Load after trip-data-sunday.js, before trip.js.
 */
(function () {
  if (!window.TRIP) return;
  var fri = window.TRIP.days[0], sat = window.TRIP.days[1];

  var trolley = null;
  fri.stops.forEach(function (s) { if (s.name.indexOf('Trolley') > -1) trolley = s; });

  var keep = ['Pirate', 'Project Swing', 'Schoolhouse', "Pizzalley", 'Kilwins', 'Crucial'];
  var kept = {};
  fri.stops.forEach(function (s) {
    keep.forEach(function (k) { if (s.name.indexOf(k) > -1) kept[k] = s; });
  });

  var walk = {
    t: '2:00', key: 1, tags: ['free', 'history'], name: 'St. George Street walk',
    type: 'Just walk \u00b7 free',
    what: 'City Gate south to the Plaza. Shaded, pedestrian only, no tickets.',
    blurb: 'The pedestrian spine of the old city, one block from the hotel. Narrow enough that the ' +
      'buildings and awnings shade most of it, which is why it works in the afternoon when the ' +
      'open sites do not. Shops, candy, old houses, buskers. Walk it slowly and decide what you ' +
      'actually want to go inside later.',
    hours: 'Always open \u00b7 shops until 8 or 9', price: 'Free',
    addr: 'St George St, City Gate to Plaza', q: 'St George Street St Augustine',
    lat: 29.8962, lng: -81.3133, walk: '2-min walk from the hotel', dur: '60\u201375 min'
  };

  var fortOutside = {
    t: '3:15', tags: ['history', 'free'], name: 'Castillo \u2014 from the outside',
    type: 'The real castle \u00b7 free to look',
    what: 'Walk the grounds and the seawall. Going inside is tomorrow.',
    blurb: 'The 1695 coquina fort, and the only actual castle in town. The grounds, moat and ' +
      'seawall are free and open \u2014 you only pay to go in. Look at it today, go inside at ' +
      '9 AM tomorrow when the gun deck still has some shade.',
    hours: 'Grounds open dawn to dusk \u00b7 interior 9\u20135', price: 'Free from outside',
    rating: '4.7', count: '38,320', addr: '11 S Castillo Dr', phone: '9048296506',
    q: 'Castillo de San Marcos', pid: 'ChIJH6jzd74n5IgRsYpaqo4LwNk',
      lat: 29.8978618, lng: -81.3115187, walk: '5-min walk', dur: '20 min'
  };

  var kingSt = {
    t: '3:45', opt: 1, tags: ['history'], name: 'King St castles \u2014 Villa Zorayda &amp; Flagler',
    type: 'The other two castles \u00b7 optional',
    what: 'Two Gilded Age palaces facing each other. Free to look, cheap to enter.',
    blurb: 'Villa Zorayda is a Moorish palace from 1883, self-guided audio tour, about an hour ' +
      '(4.6 from 813 reviews, open till 5). Directly opposite is Flagler College, the old Hotel ' +
      'Ponce de Le\u00f3n \u2014 free to step into the lobby. Lightner Museum is on the same block. ' +
      'Pick one to enter, or just look at all three from the street.',
    hours: 'Villa Zorayda 10\u20135 \u00b7 Lightner 9\u20135 \u00b7 Flagler lobby daytime',
      price: 'Free outside \u00b7 Villa Zorayda about $19 adult',
    rating: '4.6', count: '813', addr: '83 King St', phone: '9048299887',
    q: 'Villa Zorayda Museum St Augustine', pid: 'ChIJ8WFxX5Qn5IgRGlZQmbqM4qM',
    lat: 29.89158, lng: -81.315131, walk: '6-min walk from the Plaza', dur: '45\u201360 min'
  };

  function at(k, t) { if (kept[k]) { kept[k].t = t; return kept[k]; } return null; }

  fri.note = 'Walk first, tickets later. St. George is shaded and free \u2014 see the city, then ' +
    'decide what is worth going inside. Only the schoolhouse has a deadline tonight.';
  fri.stops = [walk, fortOutside, kingSt,
    at('Pirate', '4:45'), at('Crucial', '6:00'), at('Project Swing', '6:00'),
    at('Schoolhouse', '6:40'), at('Pizzalley', '7:15'), at('Kilwins', '8:30')
  ].filter(Boolean);

  if (trolley && sat) {
    trolley.t = '1:30';
    trolley.flag = 'Moved from Friday. Last trolley out is 4:30, so this is the final chance \u2014 ' +
      'and it now sits in the hot-afternoon slot, which is fine because it is shaded and seated.';
    trolley.blurb = 'Ninety minutes, seated, open air, narrated. Moved to Saturday because Friday ' +
      'went to walking the city instead. If Black Raven has the 1 PM sailing, ride the trolley ' +
      '3:00\u20134:30 instead and the day gets much easier.';
    var i = 0;
    sat.stops.forEach(function (s, n) { if (s.t === '1:20') i = n; });
    sat.stops.splice(i, 0, trolley);
  }
})();
