/* Food Intelligence \u2014 what to actually order, keyed by stop name.
 *
 * Merged into the detail sheet by assets/trip.js when a stop name matches.
 * Keep this separate from trip-data.js so the itinerary and the food notes
 * can be edited independently.
 *
 * PUBLIC REPO: use dietary ROLES, never family members' names.
 *   noFish  \u2013 the no-seafood eater
 *   fish    \u2013 the seafood eater
 *   kids    \u2013 kid-safe pick
 * Roles are rendered as labels, so the page is shareable as-is.
 *
 * Fields: roles[], signature, avoid, wait, coffee, parking, kidNote, note
 * Menus change. Treat this as a strong starting point, not gospel.
 */
window.FOOD = {
  "Georgie's Diner": {
    roles: [
      { r: 'No seafood', v: 'Country-fried steak or a build-your-own skillet \u2014 the menu is almost entirely land-based, so this is the safest room in town.' },
      { r: 'Seafood', v: 'Not the place for it. Save seafood for the bayfront dinner.' },
      { r: 'Kids', v: 'French toast or pancakes off the kids menu, side of tots. Nothing spiced, nothing seasonal.' }
    ],
    signature: 'French toast and the hash-brown tots come up again and again in reviews. Skillets are the house speciality.',
    avoid: 'Portions are enormous \u2014 order three mains for four people and split.',
    wait: 'Weekday late morning is calm. After 9 AM on a weekend expect 20+ min.',
    coffee: 'Standard diner drip, endlessly refilled. Fine, not a coffee destination.',
    parking: 'Own free lot out back \u2014 rare downtown and the main reason to start here.',
    kidNote: 'Loud, retro, oldies playing. Nobody notices a noisy table.'
  },

  'Maple Street Biscuit Co.': {
    roles: [
      { r: 'No seafood', v: 'The Squawking Goat \u2014 fried chicken, goat cheese, pepper jelly on a biscuit. No fish anywhere on the menu.' },
      { r: 'Seafood', v: 'None served. This is a chicken-and-biscuit house.' },
      { r: 'Kids', v: 'Plain chicken and waffle, or a biscuit with butter and jam. Ask them to hold the pepper jelly \u2014 it is sweet-hot and will get rejected.' }
    ],
    signature: 'Fried chicken on a biscuit in every variation, plus "bonuts" \u2014 biscuit doughnuts with jam and cream.',
    avoid: 'Anything with pepper jelly for the kids. The heat is mild for adults but reads as spicy to small palates.',
    wait: 'Order at the counter, they bring it out. Faster than a sit-down even when busy.',
    coffee: 'Good drip and espresso, better than diner standard.',
    parking: 'Street parking on Cordova, or walk \u2014 it is four minutes from the historic core.',
    kidNote: 'Communal-ish tables, casual, no pressure to be quiet.',
    note: 'Hours were not published on their listing \u2014 confirm before walking over.'
  },

  'The Blue Hen Caf\u00e9': {
    roles: [
      { r: 'No seafood', v: 'Fried chicken biscuit, or the omelet of the day. Shrimp and grits is the only seafood dish \u2014 easy to steer around.' },
      { r: 'Seafood', v: 'Shrimp and grits is the one to get, and the dish reviewers single out.' },
      { r: 'Kids', v: 'Plain buttermilk pancakes or biscuits with the peach butter. Skip the pumpkin pancakes \u2014 they are the house speciality but pumpkin is a hard no here.' }
    ],
    signature: 'Housemade biscuits with peach butter. That is the thing to order regardless of what else you get.',
    avoid: 'Pumpkin pancakes for the kids, despite being what the place is known for.',
    wait: 'Small room, closes at 2. Weekend mid-morning is the crush.',
    coffee: 'Solid local drip.',
    parking: 'Street on W King. Closest breakfast to the west side of town.',
    kidNote: 'Tight room, so a stroller is awkward. Fine for kids who sit.'
  },

  'Harbor View Caf\u00e9': {
    roles: [
      { r: 'No seafood', v: 'Waffles, eggs and bacon, or biscuits and gravy. The breakfast menu is mostly seafood-free.' },
      { r: 'Seafood', v: 'Shrimp appears at lunch \u2014 worth it if you come after 11.' },
      { r: 'Kids', v: 'The waffle. Reviewers say it needs no syrup, which usually means kids finish it.' }
    ],
    signature: 'The waffle, and the view \u2014 it sits directly on the bayfront.',
    avoid: 'Going late. Closes at 2 and the room is tiny.',
    wait: 'Before 8:30 you walk in. After that, expect to stand outside.',
    coffee: 'Diner drip.',
    parking: 'Do not drive \u2014 it is an eight-minute walk along the seawall from the historic core.',
    kidNote: 'Boats to look at while you wait for food. Underrated with small kids.'
  },

  "Pizzalley's": {
    roles: [
      { r: 'No seafood', v: 'Anything. Pizza, baked ziti, chicken parm \u2014 no seafood on the menu to dodge.' },
      { r: 'Seafood', v: 'Not served. Deliberately the safe, boring, everyone-eats choice.' },
      { r: 'Kids', v: 'A 10-inch cheese splits between two kids with slices left over.' }
    ],
    signature: 'New York-style slices, sold by the slice if you just need to plug a gap.',
    avoid: 'Over-ordering \u2014 the pies run large.',
    wait: 'Fastest sit-down dinner on St. George. No bar scene, so no 45-minute queue.',
    coffee: 'No.',
    parking: 'Walk. It is mid-way down the pedestrian street.',
    kidNote: 'Counter service energy, zero formality, food arrives quickly. The right call on a night when everyone is fried.'
  },

  'Columbia Restaurant': {
    roles: [
      { r: 'No seafood', v: 'Arroz con pollo, the Cuban sandwich, or ropa vieja. Plenty that never touches fish.' },
      { r: 'Seafood', v: 'Paella Valenciana or the snapper \u2014 this is the seafood-forward option of the trip.' },
      { r: 'Kids', v: 'Cuban sandwich cut in half, or plain rice and chicken. Ask for it simple and they will do it.' }
    ],
    signature: 'The 1905 Salad, tossed tableside \u2014 it is the reason people come, and the tableside performance works on kids.',
    avoid: 'Dinner without a booking. Lunch is far easier.',
    wait: 'Reserve. 904-824-3341.',
    coffee: 'Cuban coffee, strong and small.',
    parking: 'Walk \u2014 it is on St. George.',
    kidNote: 'Grand tiled dining room. Feels special without being stuffy about children.'
  },

  "Harry's Seafood": {
    roles: [
      { r: 'No seafood', v: 'Jambalaya with chicken and sausage, or the ribeye. Ask them to confirm no shellfish stock \u2014 Cajun kitchens often use it.' },
      { r: 'Seafood', v: 'Crawfish \u00e9touff\u00e9e or the shrimp and grits. This is the seafood dinner of the weekend.' },
      { r: 'Kids', v: 'Chicken tenders, or plain pasta. Cajun seasoning is heavier than it looks \u2014 order kid plates unseasoned.' }
    ],
    signature: '\u00c9touff\u00e9e and the bread pudding. Big Louisiana flavours in a Florida courtyard.',
    avoid: 'The back room by the restrooms. Ask for the courtyard or the bay room.',
    wait: 'Prime dinner on a Saturday is a real wait. Arriving at 6 beats it.',
    coffee: 'Skip it, get dessert.',
    parking: 'Three minutes on foot from the marina \u2014 do not move the car.',
    kidNote: 'Live music outdoors, courtyard noise covers everything. Easy with kids.'
  },

  'Casa Maya': {
    roles: [
      { r: 'No seafood', v: 'Chicken or steak fajitas, mole, or the burrito. Mostly non-seafood.' },
      { r: 'Seafood', v: 'Fish tacos and shrimp dishes are on the menu.' },
      { r: 'Kids', v: 'Quesadilla, rice and beans. Predictable and fast.' }
    ],
    signature: 'Fresh-made Mayan-influenced Mexican, not Tex-Mex. Everything made to order.',
    avoid: 'Being in a hurry \u2014 made-to-order means slower than the pizza place.',
    wait: 'Moderate. Covered patio turns over steadily.',
    coffee: 'No.',
    parking: 'Walk.',
    kidNote: 'Kitchen is good about simplifying plates on request \u2014 the best backup when someone at the table has a restriction.'
  },

  'Kilwins': {
    roles: [
      { r: 'Kids', v: 'Waffle cone, one scoop. Two scoops falls off and ends in tears.' }
    ],
    signature: 'Waffle cones made in the window \u2014 the smell is the marketing.',
    avoid: 'Nothing. It is ice cream.',
    wait: 'Evening queue on St. George moves fast.',
    parking: 'Walk. Top of St. George near the City Gate.',
    kidNote: 'The window show is half the fun. Worth the two-minute detour.'
  },

  'The Hyppo': {
    roles: [
      { r: 'Kids', v: 'Strawberry or mango \u2014 the plainest flavours. The adventurous combinations are wasted on them.' }
    ],
    signature: 'Real-fruit ice pops in unusual combinations. Many are dairy-free.',
    avoid: 'Assuming they will like the herb-and-fruit flavours. Order plain for kids, weird for adults.',
    wait: 'Quick counter.',
    parking: 'Walk. Two blocks off the Plaza.',
    kidNote: 'Less mess than ice cream in August heat, and no dairy if that matters.'
  },

  'Crucial Coffee': {
    roles: [{ r: 'Kids', v: 'Ice cream or a pastry while the adults sit down.' }],
    signature: 'Espresso, pastries, ice cream and beer under string lights.',
    coffee: 'Proper espresso \u2014 the best coffee stop directly across from the fort.',
    wait: 'Tiny place, quick queue.',
    parking: 'Walk.',
    kidNote: 'Shaded outdoor seating means nobody has to sit still indoors.'
  }
};
