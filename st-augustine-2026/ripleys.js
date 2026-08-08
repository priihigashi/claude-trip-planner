/* Ripley's Believe It or Not!
 *
 * Open 10 AM \u2013 9 PM daily, which is later than almost everything else here \u2014
 * so it fits the evening, not a half-day Sunday morning that already has an
 * anchor. Five-minute walk from the hotel, never a trolley decision.
 * Load after coffee.js.
 */
(function () {
  if (!window.TRIP) return;

  var r = {
    t: '4:15', opt: 1, tags: ['kids', 'rest'], name: 'Ripley\u2019s Believe It or Not!',
    type: 'Optional \u00b7 indoor \u00b7 open till 9',
    what: 'Oddities and illusions in an 1887 Moorish mansion. New mirror maze.',
    blurb: 'Self-guided, one to two hours, entirely indoors and open until 9 PM \u2014 the latest ' +
      'option in town, so it works after dinner too. Housed in Castle Warden, which is worth ' +
      'seeing in itself. Bring quarters: some of the interactive games are coin-only.',
    hours: '10:00 AM \u2013 9:00 PM daily', price: 'About $30 adult \u00b7 the priciest add-on today',
    rating: '4.4', count: '9,453', addr: '19 San Marco Ave', phone: '9048241606',
    q: 'Ripleys Believe It or Not St Augustine', pid: 'ChIJJSDL7L4n5IgR56CZiERtCPE',
    lat: 29.8995645, lng: -81.3138818, walk: '5-min walk', dur: '1\u20132 hr',
    flag: 'Reviewers suggest skipping it with children under 6 \u2014 some displays skew older and odd. ' +
      'Plan on a walk-through rather than the full two hours.'
  };

  function add(list) {
    if (list.some(function (s) { return s.name.indexOf('Ripley') > -1; })) return list;
    var out = [], done = false;
    list.forEach(function (s) {
      if (!done && (s.t === '4:45' || s.t === '5:50')) { out.push(r); done = true; }
      out.push(s);
    });
    if (!done) out.push(r);
    return out;
  }

  if (window.SAT_VARIANTS) {
    Object.keys(window.SAT_VARIANTS).forEach(function (k) {
      window.SAT_VARIANTS[k].stops = add(window.SAT_VARIANTS[k].stops);
    });
  }
  if (window.TRIP.days[1]) window.TRIP.days[1].stops = add(window.TRIP.days[1].stops);
})();
