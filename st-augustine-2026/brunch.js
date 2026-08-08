/* Saturday brunch \u2014 walking distance, eggs, Bloody Mary, 4.4 stars minimum.
 * Maple Street was the wrong call: counter service, no bar. Replaced.
 * Load after trip-data-saturday.js.
 */
(function () {
  if (!window.TRIP || !window.TRIP.days[1]) return;
  var sat = window.TRIP.days[1];

  var brunch = {
    t: '11:00', key: 1, tags: ['food'], name: "PK's Roosevelt Room",
    type: 'Brunch \u00b7 eggs and cocktails',
    what: 'Proper sit-down brunch on St. George. 4.7 stars, 5-minute walk.',
    blurb: 'The highest-rated brunch inside the historic district and the only one at that level you ' +
      'can walk to. Eggs, grits reviewers rave about, and a churro waffle the kids will fight over. ' +
      'Full bar \u2014 mimosas come up repeatedly in reviews. Bright, calm room, not a pub.',
    hours: '9:00 AM \u2013 2:00 PM Sat', price: '$$', rating: '4.7', count: '752',
    addr: '121 St George St', phone: '9042095700', q: 'PKs Roosevelt Room St Augustine',
    pid: 'ChIJnTckO2In5IgR1t7xN_vz4Wo', lat: 29.894079, lng: -81.3127632,
    walk: '5-min walk', dur: '80 min',
    flag: 'Ring ahead to confirm they pour Bloody Marys and to hold a table \u2014 904-209-5700. ' +
      'Kitchen shuts at 2.',
    alts: [
      { n: 'Ice Plant Bar', d: 'Best cocktail bar in the city \u00b7 4.7 (4,402) \u00b7 opens 10 Sat \u00b7 20-min walk',
        q: 'Ice Plant Bar St Augustine', id: 'ChIJnXpQpewn5IgR7k9yxWXUu1M' },
      { n: 'Sunday', d: 'Bakery brunch, sourdough and mimosas \u00b7 4.6 (781) \u00b7 8:30\u20133 \u00b7 10-min walk',
        q: 'Sunday restaurant San Marco St Augustine', id: 'ChIJra-_R1In5IgRWhb4ZuBDUeQ' },
      { n: 'Prohibition Kitchen', d: 'Gastropub, full bar \u00b7 4.4 (7,693) \u00b7 opens 11 \u00b7 on St. George',
        q: 'Prohibition Kitchen St Augustine', id: 'ChIJC2do4JUn5IgRuCCaO-aklds' }
    ]
  };

  for (var i = 0; i < sat.stops.length; i++) {
    if (sat.stops[i].t === '11:00') { sat.stops[i] = brunch; return; }
  }
  sat.stops.splice(1, 0, brunch);
})();
