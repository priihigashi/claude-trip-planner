/* Saturday 8 Aug, as it actually ran.
 *
 * Boarded the trolley late morning, 15 min at the Fountain of Youth, 65 min at
 * the Old Jail. Still unfed at 1:20, and PK's closes at 2 \u2014 so lunch moves to
 * Sunday on San Marco (open till 3, and on the walk back).
 * Load after ripleys.js.
 */
(function () {
  if (!window.TRIP) return;

  var lunch = {
    t: '1:35', key: 1, tags: ['food'], name: 'Lunch \u00b7 Sunday',
    type: 'Late lunch \u00b7 closes 3',
    what: 'Bakery brunch on San Marco. 8-min walk south from the Old Jail, on the way home.',
    blurb: 'The only good option still serving between the jail and the hotel. Sourdough, eggs, ' +
      'biscuit sandwiches, mimosas. Casual \u2014 no thought required about what you are wearing. ' +
      'Kitchen stops at 3, so this is the last comfortable window today.',
    hours: '8:30 AM \u2013 3:00 PM', price: '$$', rating: '4.6', count: '781',
    addr: '73 San Marco Ave', q: 'Sunday restaurant San Marco St Augustine',
    pid: 'ChIJra-_R1In5IgRWhb4ZuBDUeQ', lat: 29.9019, lng: -81.3172,
    walk: '8-min walk from the jail', dur: '60 min',
    flag: 'PK\u2019s Roosevelt Room shut at 2 \u2014 it is off the table today.',
    alts: [
      { n: 'Columbia', d: 'Open till 10, no closing clock \u00b7 4.4 (14,193) \u00b7 ride to Stop 2 then walk 10 min',
        q: 'Columbia Restaurant St Augustine', id: 'ChIJ8xR18JUn5IgRfwJJByM-quU' },
      { n: 'Casa Maya', d: 'Until 11 PM, casual patio \u00b7 4.3 (3,340)',
        q: 'Casa Maya St Augustine', id: 'ChIJofgqBJYn5IgRVa-HQvp6KDk' },
      { n: "Pizzalley's", d: 'The 5/5 from Friday, no wait \u00b7 until 8:30',
        q: 'Pizzalleys on St George St Augustine', id: 'ChIJL7xS4JUn5IgR12J0Ib8SrSc' }
    ]
  };

  function reset(list) {
    var keep = list.filter(function (s) {
      return ['Ripley', 'Project Swing', 'Kilwins', 'Colonial Quarter', 'Hyppo']
        .some(function (k) { return s.name.indexOf(k) > -1; });
    });
    var byName = {};
    keep.forEach(function (s) { byName[s.name] = s; });
    function at(k, t) {
      for (var n in byName) if (n.indexOf(k) > -1) { byName[n].t = t; return byName[n]; }
      return null;
    }
    return [lunch, at('Hyppo', '3:00'), at('Ripley', '3:45'), at('Project Swing', '5:45'),
      at('Colonial Quarter', '4:00'), at('Kilwins', '8:15')].filter(Boolean)
      .sort(function (a, b) {
        function m(x) { var p = x.t.split(':'); var h = +p[0]; if (h < 8) h += 12; return h * 60 + +p[1]; }
        return m(a) - m(b);
      });
  }

  if (window.SAT_VARIANTS) {
    Object.keys(window.SAT_VARIANTS).forEach(function (k) {
      window.SAT_VARIANTS[k].stops = reset(window.SAT_VARIANTS[k].stops);
      window.SAT_VARIANTS[k].note = 'Trolley done, nobody has eaten. Lunch first, then whatever the ' +
        'kids still have energy for.';
    });
  }
  if (window.TRIP.days[1]) {
    window.TRIP.days[1].stops = reset(window.TRIP.days[1].stops);
    window.TRIP.days[1].note = 'Trolley done, nobody has eaten. Lunch first, then whatever the kids ' +
      'still have energy for.';
  }

  /* log what happened */
  var KEY = 'trip-log:' + location.pathname;
  var FLAG = 'trip-seed-day2:' + location.pathname;
  try {
    if (localStorage.getItem(FLAG)) return;
    var D = function (h, m) { return new Date(2026, 7, 8, h, m).getTime(); };
    var st = JSON.parse(localStorage.getItem(KEY)) || { visited: [], skipped: [] };
    [
      { name: 'Quick coffee + pastry', lat: 29.8997022, lng: -81.3155722, di: 1, t: D(10, 20),
        custom: 1, note: 'Bagel and cake at the hotel Starbucks before heading out.' },
      { name: 'Old Town Trolley', lat: 29.8989, lng: -81.316, di: 1, t: D(11, 10),
        note: 'Boarded Stop 2. Rode the loop rather than hopping off downtown.' },
      { name: 'Fountain of Youth', lat: 29.9069444, lng: -81.315, di: 1, t: D(12, 5),
        custom: 1, rating: 3, note: 'Only 15 minutes \u2014 a quick look, not the full two hours.' },
      { name: 'The Old Jail', lat: 29.9057, lng: -81.3235, di: 1, t: D(12, 20),
        custom: 1, note: 'Stayed 65 minutes. The stop that justified the trolley ticket \u2014 the ' +
          'only part of the loop not within walking distance of the hotel.' }
    ].forEach(function (s) {
      if (!st.visited.some(function (v) { return v.name === s.name; })) st.visited.push(s);
    });
    localStorage.setItem(KEY, JSON.stringify(st));
    localStorage.setItem(FLAG, '1');
  } catch (e) {}
})();
