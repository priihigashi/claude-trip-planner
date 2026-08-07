/* Verdicts \u2014 what we thought after actually eating there.
 * Merged into window.FOOD and shown as a highlighted line on the food card.
 * Load after food.js.
 */
(function () {
  if (!window.FOOD) return;
  var V = {
    'The Blue Hen Caf\u00e9': 'Went 7 Aug, rated 4/5. Chicken biscuits were good but dry on their own \u2014 ' +
      'ask for jam or marmalade on the side. The pancakes come in several flavours beyond the ' +
      'house pumpkin; worth ordering one of those next time.'
  };
  Object.keys(V).forEach(function (k) { if (window.FOOD[k]) window.FOOD[k].verdict = V[k]; });
})();
