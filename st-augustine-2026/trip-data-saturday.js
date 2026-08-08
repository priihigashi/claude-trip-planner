/* Saturday, rebuilt around meals.
 *
 * Brunch at 11, a late lunch/dinner, and a treat to finish. Replaces the day
 * wholesale so nothing from the earlier draft leaks through.
 * Checkout belongs to Sunday only \u2014 it is not in this list.
 * Load after trip-data-revise.js.
 */
(function () {
  if (!window.TRIP || !window.TRIP.days[1]) return;
  var sat = window.TRIP.days[1];
  sat.label = 'Sat \u00b7 full day';
  sat.note = 'Slow start, brunch at 11, the living-history tour in the early afternoon, then a late ' +
    'meal and a treat. The fort pass from yesterday is still valid all week, so the morning is free.';

  sat.stops = [
  { t: '9:00', opt: 1, tags: ['history', 'free'], name: 'Castillo again \u2014 gun deck',
    type: 'Free on yesterday\u2019s pass',
    what: 'Cool morning, empty ramparts, no extra cost.',
    blurb: 'Your ticket is good for seven days, so this costs nothing. Worth an hour just for the ' +
      'gun deck and the bay before it heats up. Skip entirely if everyone wants to sleep in.',
    hours: '9:00 AM \u2013 5:00 PM', price: 'Free \u2014 already paid', rating: '4.7', count: '38,320',
    addr: '11 S Castillo Dr', phone: '9048296506', q: 'Castillo de San Marcos',
    pid: 'ChIJH6jzd74n5IgRsYpaqo4LwNk', lat: 29.8978618, lng: -81.3115187,
    walk: '3-min walk', dur: '60 min' },

  { t: '11:00', key: 1, tags: ['food'], name: 'Brunch \u00b7 Maple Street Biscuit Co.',
    type: 'Breakfast \u00b7 chicken &amp; waffles',
    what: 'Chicken and waffles, biscuit sandwiches, bonuts. 4-min walk.',
    blurb: 'Order at the counter, sit anywhere, the cook brings it out. They will do the waffles soft ' +
      'for the kids. Eleven is past the early rush, so the queue should be short.',
    hours: 'Opens around 7 AM \u2014 confirm in Maps', price: '$$', rating: '4.5', count: '3,402',
    addr: '39 Cordova St', phone: '9042177814', q: 'Maple Street Biscuit Company St Augustine',
    pid: 'ChIJ16XdhpUn5IgRog_yANrex8Q', lat: 29.8952259, lng: -81.3145454,
    walk: '4-min walk', dur: '70 min',
    alts: [{ n: 'Harbor View Caf\u00e9', d: 'Waffles on the water \u00b7 closes 2 PM \u00b7 4.4 (1,087)', q: 'Harbor View Cafe St Augustine', id: 'ChIJEwIeH5Yn5IgRlSLo50SFDI0' },
      { n: 'Columbia', d: 'Sit-down brunch, 1905 salad \u00b7 opens 11 \u00b7 4.4 (14,193)', q: 'Columbia Restaurant St Augustine', id: 'ChIJ8xR18JUn5IgRfwJJByM-quU' },
      { n: "Georgie's Diner", d: 'Skillets and French toast until 3 \u00b7 free parking', q: 'Georgies Diner St Augustine', id: 'ChIJywhop-sn5IgR2FX_DJgy8w8' }] },

  { t: '12:30', tags: ['free', 'history'], name: 'Walk the south end',
    type: 'City walk \u00b7 free',
    what: 'Plaza, Cathedral, then Aviles St \u2014 the part you did not reach yesterday.',
    blurb: 'You turned around before the Plaza on Friday. This is the other half: the oldest public ' +
      'square, the Cathedral (free, fifteen minutes), and Aviles Street, the oldest street in the ' +
      'country and almost empty.',
    hours: 'Cathedral 8:00 AM \u2013 5:00 PM', price: 'Free', rating: '4.8', count: '3,451',
    addr: '38 Cathedral Pl', q: 'Cathedral Basilica of St Augustine',
    pid: 'ChIJw5kQd5Yn5IgRZWp4aEBLGmg', lat: 29.8931252, lng: -81.3123911,
    walk: '6-min walk', dur: '50 min' },

  { t: '1:30', key: 1, tags: ['history', 'kids'], name: 'Colonial Quarter',
    type: 'History the kids like',
    what: 'Living-history tour: blacksmith, musket firing, watchtower.',
    blurb: 'Tours run about hourly \u2014 10:30, 12:00, 1:30 and 3:00 \u2014 roughly an hour, ending with ' +
      'a musket demonstration. The 1:30 fits brunch and still leaves the afternoon open.',
    hours: '10:00 AM \u2013 5:00 PM', price: 'About $16 adult \u00b7 $10 kids 5\u201315 \u00b7 4 and under free',
    rating: '4.6', count: '505', addr: '14 S Castillo Dr', phone: '9043422869',
    q: 'Colonial Quarter St Augustine', pid: 'ChIJaXSQbL4n5IgR41hDG9udv2o',
    lat: 29.8967467, lng: -81.3129109, walk: '5-min walk', dur: '60 min',
    flag: 'Confirm the 1:30 tour is running when you buy \u2014 times move in summer.' },

  { t: '2:45', tags: ['food', 'kids'], name: 'Snack \u00b7 The Hyppo',
    type: 'Cool-down',
    what: 'Real-fruit ice pops, lots of dairy-free. Two blocks off the Plaza.',
    blurb: 'Less mess than ice cream in the heat, and it holds the kids until a late dinner. Order ' +
      'the plain fruit flavours for them and something odd for yourself.',
    hours: '11:00 AM \u2013 11:00 PM Sat', price: '$', rating: '4.8', count: '1,151',
    addr: '48 Charlotte St', phone: '9047920374', q: 'The Hyppo Gourmet Ice Pops St Augustine',
    pid: 'ChIJQeGGBpYn5IgRYtLyxa40ofc', lat: 29.8951251, lng: -81.3119505,
    walk: '4-min walk', dur: '20 min' },

  { t: '3:15', opt: 1, tags: ['rest'], name: 'Pool \u00b7 AC', type: 'Rest stop',
    what: 'Out of the sun through the worst of the afternoon.',
    blurb: 'This block is what makes a late dinner possible with kids. Storms usually roll through ' +
      'between 1 and 4 anyway.',
    hours: '\u2014', price: '\u2014', addr: 'Downtown', q: 'Castillo Dr St Augustine',
    lat: 29.8992, lng: -81.3158, walk: '5-min walk', dur: '75 min' },

  { t: '4:45', opt: 1, tags: ['kids'], name: 'Black Raven pirate ship',
    type: 'Only if you book it',
    what: 'Sword fights, cannons, treasure. 90 min on the water.',
    blurb: 'Still not booked, and it sells out. If you want it, ring this morning \u2014 otherwise the ' +
      'afternoon stays free and dinner moves earlier.',
    hours: 'Sailings 1:00 PM and 4:00 PM', price: '$44.95 adult \u00b7 $39.95 child 3\u201312',
    rating: '4.4', count: '1,219', addr: '111 Avenida Menendez \u2014 Municipal Marina',
    phone: '9048260000', q: 'Black Raven Pirate Ship St Augustine',
    pid: 'ChIJVVyd-ZYn5IgRYT-Ia-TCB_8', lat: 29.8917553, lng: -81.3104262,
    walk: '15-min walk', dur: '90 min',
    flag: 'Not booked. Call 904-826-0000 or drop this and eat earlier.' },

  { t: '6:45', key: 1, tags: ['food'], name: 'Late lunch/dinner \u00b7 Columbia',
    type: 'The proper meal',
    what: 'Spanish tiles, 1905 salad tossed at the table.',
    blurb: 'One real sit-down meal for the trip. The room itself is a landmark and the tableside salad ' +
      'is a small show for the kids. Non-seafood options are plentiful \u2014 arroz con pollo, the ' +
      'Cuban sandwich, ropa vieja \u2014 and there is paella for the seafood side of the table.',
    hours: '11:00 AM \u2013 10:00 PM', price: '$$', rating: '4.4', count: '14,193',
    addr: '98 St George St', phone: '9048243341', q: 'Columbia Restaurant St Augustine',
    pid: 'ChIJ8xR18JUn5IgRfwJJByM-quU', lat: 29.894835, lng: -81.313145,
    walk: '6-min walk', dur: '90 min',
    flag: 'Book it. 904-824-3341. Saturday dinner without a table is a long wait.',
    alts: [{ n: "Harry's Seafood", d: 'Bayfront courtyard, live music \u00b7 4.6 (16,043)', q: 'Harrys Seafood Bar and Grille St Augustine', id: 'ChIJ8aLBaJYn5IgR60p2CS_RHIw' },
      { n: 'Casa Maya', d: 'Mexican, patio, easy with restrictions \u00b7 4.3 (3,340)', q: 'Casa Maya St Augustine', id: 'ChIJofgqBJYn5IgRVa-HQvp6KDk' },
      { n: "Pizzalley's", d: 'The known quantity \u2014 5/5 from Friday, no wait', q: 'Pizzalleys on St George St Augustine', id: 'ChIJL7xS4JUn5IgR12J0Ib8SrSc' }] },

  { t: '8:30', tags: ['food', 'kids'], name: 'Treat \u00b7 Kilwins',
    type: 'Finish the night',
    what: 'Waffle cones made in the window, on the walk home.',
    blurb: 'The upgrade on Friday\u2019s ice cream. Top of St. George near the City Gate, so it is ' +
      'directly on the way back. Ben & Jerry\u2019s at 128 St George is the dairy-free alternative.',
    hours: '10:00 AM \u2013 10:00 PM Sat', price: '$', rating: '4.4', count: '292',
    addr: '6 St George St', phone: '9048239226', q: 'Kilwins St George Street St Augustine',
    pid: 'ChIJhWCYaL4n5IgRZ5rTA9gxkxA', lat: 29.8975215, lng: -81.3136587,
    walk: '5-min walk', dur: '25 min',
    alts: [{ n: "Ben & Jerry's", d: '128 St George \u00b7 best dairy-free range \u00b7 4.5 (515)', q: 'Ben and Jerrys St George Street St Augustine', id: 'ChIJhSDeUpUn5IgRDs6ycSD-Sto' }] }
  ];
})();
