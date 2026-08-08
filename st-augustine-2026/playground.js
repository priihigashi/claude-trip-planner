/* Project Swing playground.
 *
 * It was only on Friday, which has now passed \u2014 so it fell off the plan even
 * though it is one minute from the hotel and free. Added to Saturday evening
 * and to Sunday morning before checkout.
 * Load after sat-variants.js.
 */
(function () {
  if (!window.TRIP) return;

  function stop(t) {
    return {
      t: t, opt: 1, tags: ['kids', 'free', 'rest'], name: 'Project Swing playground',
      type: 'Free \u00b7 kids \u00b7 1 min from the hotel',
      what: 'Castle-themed wooden playground, fully shaded, single entrance.',
      blurb: 'Directly across Castillo Drive from the hotel. Separate areas for big and small kids, ' +
        'a covered pavilion with benches in the middle, and one way in and out so you can sit down ' +
        'while they run. Wood equipment is too hot at midday and fine by evening. Free, and the ' +
        'cheapest way to burn off energy in the city.',
      hours: '7:30 AM \u2013 7:00 PM', price: 'Free', rating: '4.4', count: '366',
      addr: '25 W Castillo Dr', q: 'Project Swing Park St Augustine',
      pid: 'ChIJVfknmr8n5IgRolaYSlS6anc', lat: 29.8981986, lng: -81.316876,
      walk: '1-min walk', dur: '20\u201330 min'
    };
  }

  /* Saturday \u2014 both versions, after the pool block, before dinner. Closes at 7. */
  function addSat(list) {
    if (list.some(function (s) { return s.name.indexOf('Project Swing') > -1; })) return list;
    var out = [], done = false;
    list.forEach(function (s) {
      if (!done && s.t === '6:45') { out.push(stop('5:50')); done = true; }
      out.push(s);
    });
    if (!done) out.push(stop('5:50'));
    return out;
  }

  if (window.SAT_VARIANTS) {
    Object.keys(window.SAT_VARIANTS).forEach(function (k) {
      window.SAT_VARIANTS[k].stops = addSat(window.SAT_VARIANTS[k].stops);
    });
  }
  if (window.TRIP.days[1]) window.TRIP.days[1].stops = addSat(window.TRIP.days[1].stops);

  /* Sunday \u2014 straight after breakfast, before checkout. Opens 7:30. */
  var sun = window.TRIP.days[2];
  if (sun && !sun.stops.some(function (s) { return s.name.indexOf('Project Swing') > -1; })) {
    var s = stop('8:45');
    s.blurb += ' On a half day this is the easiest win before checkout \u2014 twenty minutes, no ' +
      'tickets, no driving.';
    sun.stops.splice(1, 0, s);
  }
})();
