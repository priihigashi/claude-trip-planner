/* Two versions of Saturday.
 *
 * A \u2014 Walking day (default). Fort in the morning on yesterday's pass, brunch
 *     at 11, tour at 1:30.
 * B \u2014 Trolley day. Board Stop 2 at 10:40, ride the west side you cannot walk
 *     to, hop off at Stop 14 (Plaza) and brunch three minutes away.
 *
 * The restaurant does NOT need to change: PK's Roosevelt Room is 3 minutes from
 * Stop 14 and serves until 2. What changes is the morning.
 */
(function () {
  if (!window.TRIP || !window.TRIP.days[1]) return;
  var sat = window.TRIP.days[1];
  var byTime = {};
  sat.stops.forEach(function (s) { byTime[s.t] = s; });

  window.SAT_VARIANTS = {
    walk: {
      label: 'Walking day',
      note: sat.note,
      stops: sat.stops.slice()
    },
    trolley: {
      label: 'Trolley day',
      note: 'Board at Stop 2 (one block from the hotel, no car needed), ride the west side you ' +
        'cannot reach on foot, hop off at the Plaza for brunch. Same restaurant \u2014 it is three ' +
        'minutes from Stop 14.',
      stops: [
        { t: '10:40', key: 1, tags: ['kids', 'history'], name: 'Board the trolley \u00b7 Stop 2',
          type: 'Visitor Center, one block away',
          what: 'No car, no parking. Ride to Stop 14 at the Plaza.',
          blurb: 'About 12 stops and 50\u201355 minutes to the Plaza, covering Villa Zorayda, Flagler, ' +
            'Lightner, Lincolnville, the distillery and Whetstone \u2014 the whole half of town that is ' +
            'too far to walk in August. Stay on until Stop 14.',
          hours: '9:00 AM \u2013 4:30 PM \u00b7 every 15\u201320 min', price: 'About $34\u201340 adult \u00b7 3 and under free',
          rating: '4.6', count: '10,155', addr: 'Stop 2, Visitor Center, 10 W Castillo Dr',
          phone: '9048293800', q: 'Old Town Trolley Tours St Augustine',
          pid: 'ChIJBxIdDsgn5IgRgGwG3J1ZDdE', lat: 29.8989, lng: -81.316,
          walk: '1-min walk', dur: '55 min',
          flag: 'Saturday morning trolleys can board full \u2014 leave 15 min of slack in case you wave ' +
            'one through. Ask about the 2-day pass if you want the free Beach Bus on Sunday.' },
        byTime['11:00'] && (function () {
          var b = Object.create(byTime['11:00']);
          b.t = '11:50';
          b.walk = '3-min walk from Stop 14';
          return b;
        })(),
        byTime['1:30'], byTime['2:45'], byTime['3:15'], byTime['4:45'],
        byTime['6:45'], byTime['8:30']
      ].filter(Boolean)
    }
  };
})();
