/* Sunday half day. Appended to window.TRIP.days so trip-data.js stays as written.
 * Load after trip-data.js and before trip.js. */
window.TRIP && window.TRIP.days.push({
  id: 'sun', label: 'Sun \u00b7 half day',
  note: 'Checkout, one big thing, then the drive home. Pick ONE of the two anchors \u2014 they are both 9 AM and both across the bridge.',
  stops: [
  { t: '8:00', tags: ['food'], name: 'Breakfast \u00b7 your pick', type: 'Last meal here',
    what: 'Whichever of the two breakfasts won. Keep it quick.',
    blurb: 'Sunday is short. Go back to whichever place worked rather than gambling on a third.',
    hours: 'Check the place you choose', price: '$', addr: 'Downtown',
    q: 'breakfast St Augustine', lat: 29.8952259, lng: -81.3145454, walk: '\u2014', dur: '45 min' },

  { t: '9:00', key: 1, tags: ['kids'], name: 'Alligator Farm', type: 'Anchor option A \u00b7 kids',
    what: 'Every crocodilian species on earth, plus a zip line and a bird rookery.',
    blurb: 'One of very few places anywhere with all crocodilian species. Feedings and shows run through the morning, it is shaded, and it holds small kids for two easy hours.',
    hours: '9:00 AM \u2013 5:00 PM', price: 'About $35 adult \u00b7 discounts for kids',
    rating: '4.7', count: '11,797', addr: '999 Anastasia Blvd', phone: '9048243337',
    q: 'St Augustine Alligator Farm', pid: 'ChIJ0UaxcHon5IgRtIDfdNZ5UsQ',
    lat: 29.8818461, lng: -81.2885721, walk: '10-min drive', dur: '2 hr',
    flag: 'Pick this OR the Lighthouse. Both at 9, both across the Bridge of Lions \u2014 not enough time for two.' },

  { t: '9:00', tags: ['history', 'kids'], name: 'St. Augustine Lighthouse', type: 'Anchor option B \u00b7 history',
    what: '219 steps, huge view, maritime museum and shaded trails.',
    blurb: 'The climb is the draw and the view at the top is the best in the county. Museum and a playground area at the base for anyone who does not want the stairs. Free parking.',
    hours: '9:00 AM \u2013 6:00 PM', price: 'About $18 \u00b7 free parking',
    rating: '4.7', count: '15,625', addr: '100 Red Cox Dr', phone: '9048290745',
    q: 'St Augustine Lighthouse Maritime Museum', pid: 'ChIJS3j7AnEn5IgRj0GbuJwbvpg',
    lat: 29.8853844, lng: -81.2882812, walk: '10-min drive', dur: '2 hr',
    flag: 'Height limit on the climb \u2014 kids must be 44 inches to go up alone with an adult.' },

  { t: '9:00', opt: 1, tags: ['history'], name: 'Fountain of Youth', type: 'Anchor option C \u00b7 history',
    what: 'The actual 1565 founding site. Peacocks, cannon firings, planetarium.',
    blurb: 'The one anchor that is NOT across the bridge \u2014 it is five minutes north of downtown, so it costs the least driving. Mostly outdoors, which matters in August.',
    hours: '9:00 AM \u2013 5:00 PM', price: 'About $20 adult', rating: '4.5', count: '8,617',
    addr: '11 Magnolia Ave', phone: '9048293168', q: 'Fountain of Youth St Augustine',
    pid: 'ChIJ411Zhrcn5IgRYE_XYdj5Hbs', lat: 29.9069444, lng: -81.315, walk: '5-min drive', dur: '2 hr' },

  { t: '11:00', tags: ['logistics'], name: 'Checkout', type: 'Logistics',
    what: 'Bags in the car. Most hotels here check out at 11.',
    blurb: 'Do this before the anchor if checkout is strict, or ask to leave bags and collect them after.',
    hours: 'Typically 11:00 AM', price: '\u2014', addr: 'Downtown', q: 'Castillo Dr St Augustine',
    lat: 29.8992, lng: -81.3158, walk: '\u2014', dur: '20 min' },

  { t: '11:30', opt: 1, tags: ['food'], name: 'Last stop \u00b7 lunch or a pop', type: 'Optional',
    what: 'Something quick before the drive, or skip it and eat on the road.',
    blurb: 'The Hyppo travels well in the car. A sit-down lunch adds an hour you may not want.',
    hours: '\u2014', price: '$', addr: 'Downtown', q: 'The Hyppo Gourmet Ice Pops St Augustine',
    pid: 'ChIJQeGGBpYn5IgRYtLyxa40ofc', lat: 29.8951251, lng: -81.3119505, walk: '\u2014', dur: '30 min' }
]});
