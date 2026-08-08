/* Food notes and verdicts.
 * Load after food.js.
 */
(function () {
  if (!window.FOOD) return;

  window.FOOD["PK's Roosevelt Room"] = {
    roles: [
      { r: 'No seafood', v: 'Eggs any style, the pork chop, or the churro waffle. Crab cakes are the only thing to steer around.' },
      { r: 'Seafood', v: 'Crab cakes \u2014 reviewers say more crab than breadcrumb.' },
      { r: 'Kids', v: 'Churro waffle. Reviewers single it out: crisp edges, warm centre, not sickly sweet.' }
    ],
    signature: 'The grits get named in review after review, and the churro waffle is the thing people come back for.',
    avoid: 'Turning up at 1:45 \u2014 the kitchen closes at 2.',
    wait: 'Walk-ins have been seated fast even in groups of six, but a Saturday at 11 is peak.',
    coffee: 'Full bar and proper coffee \u2014 mimosas mentioned throughout the reviews.',
    parking: 'Walk. It is on St. George, five minutes from the hotel.',
    kidNote: 'Elevated room but not stuffy; families are normal here.'
  };

  window.FOOD['The Sweet Spot'] = {
    roles: [{ r: 'Kids', v: 'Plain scoop in a cup. The over-the-top sundaes look better than they taste.' }],
    signature: 'Trend-driven ice cream and milkshakes, 4.7 from 864 reviews.',
    wait: 'Evening queue on St. George; service is hit or miss.',
    parking: 'Walk \u2014 32 St George St.',
    kidNote: 'Open until 10, later than most of the street.',
    verdict: 'Went 7 Aug, rated 3/5. Fine, not worth crossing the street for. Kilwins (6 St George) or ' +
      'Ben & Jerry\u2019s (128 St George, good dairy-free range) are the better calls.'
  };

  var V = {
    'The Blue Hen Caf\u00e9': 'Went 7 Aug, rated 4/5. Chicken biscuits were good but dry on their own \u2014 ' +
      'ask for jam or marmalade on the side. The pancakes come in several flavours beyond the ' +
      'house pumpkin; worth ordering one of those next time.',
    "Pizzalley's": 'Went 7 Aug, rated 5/5. The ricotta, pepperoni and hot honey pizza is the one to ' +
      'order \u2014 the sweet-hot combination carried the meal. Lasagna also good. Kids shared a cheese ' +
      'pizza and a spaghetti at $10 each, which fed them both easily. Fast, no wait, no fuss.'
  };
  Object.keys(V).forEach(function (k) { if (window.FOOD[k]) window.FOOD[k].verdict = V[k]; });
})();
