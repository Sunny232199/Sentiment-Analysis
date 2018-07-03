var Sentiment = require('sentiment');
var sentiment = new Sentiment();
module.exports = function(text) {
  return sentiment.analyze(text);
};