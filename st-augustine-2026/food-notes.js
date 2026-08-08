/* Verdicts \u2014 what we thought after actually eating there.
 * Merged into window.FOOD and shown as a highlighted line on the food card.
 * Load after food.js.
 */
(function () {
  if (!window.FOOD) return;

  window.FOOD['The Sweet Spot'] = {
    roles: [{ r: 'Kids', v: 'Plain scoop in a cup. The viral over-the-top sundaes look better than they taste.' }],
    signature: 'Trend-driven ice cream and milkshakes, personalised cups and spoons, 4.7 from 864 reviews.',
    wait: 'Evening queue on St. George; service is hit or miss by who is working.',
    parking: 'Walk \u2014 32 St George St.',
    kidNote: 'Open until 10, which is later than most things on the street.',
    verdict: 'Went 7 Aug, rated 3/5. Fine, not worth crossing the street for. Kilwins (6 St George, ' +
      'waffle cones made in the window) or Ben & Jerry\u2019s (128 St George, good dairy-free range) ' +
      'are the better calls next time.'
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
