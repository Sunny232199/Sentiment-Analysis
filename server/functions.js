var request = require('request');
var config = require('./config');
var Sentiment = require('sentiment');
var sentiment = new Sentiment();
var trainedData = require('./traineddata');

functions = {
    authorize: function(req, res) {
        var header = config.consumerkey + ':' +config.consumersecret;
        var encheader = new Buffer(header).toString('base64');
        var finalheader = 'Basic ' + encheader;
        
        request.post('https://api.twitter.com/oauth2/token', {form: {'grant_type': 'client_credentials'}, 
        headers: {Authorization: finalheader}}, function(error, response, body) {
            if(error)
            console.log(error);
            else {
                config.bearertoken = JSON.parse(body).access_token;
                
                res.json({success: true, data:config.bearertoken});
            }
            
        })
    }
,
    search: function(req, res) {
        var searchquery = req.body.query;
        var encsearchquery = encodeURIComponent(searchquery);
        var bearerheader = 'Bearer ' + config.bearertoken;
        request.get('https://api.twitter.com/1.1/search/tweets.json?q=' + encsearchquery +
         '&result_type=recent', {headers: {Authorization: bearerheader}}, function(error, body, response) {
             if(error)
             console.log(error);
             else {
                 res.json({success: true, data:JSON.parse(body.body)});
             }
         })
    }
,
search30Days: function(req, res) {
    var searchquery = req.body.query;
    var encsearchquery = encodeURIComponent(searchquery);
    var bearerheader = 'Bearer ' + config.bearertoken;
    request.get('https://api.twitter.com/1.1/search/tweets.json?q=' + encsearchquery +
     '&count=100&lang=eu&result_type=recent', {headers: {Authorization: bearerheader}}, function(error, body, response) {
         if(error)
         console.log(error);
         else {
             res.json({success: true, data:JSON.parse(body.body)});
         }
     })
},



timeline: function(req, res) {
    var searchquery = req.body.query;
    var encsearchquery = encodeURIComponent(searchquery);

    var bearerheader = 'Bearer ' + config.bearertoken;
    request.get('https://api.twitter.com/1.1/search/tweets.json?q=' + encsearchquery +
     '&count=100&result_type=recent', {headers: {Authorization: bearerheader}}, function(error, body, response) {
         if(error)
         console.log(error);
         else {
            var response = [];
             var statuses = JSON.parse(body.body).statuses;
             for(var i=0; i < statuses.length;i++){
                var resp = {};
                resp.tweet = statuses[i];
                resp.sentiment =  sentiment.analyze(statuses[i].text,trainedData);
                response.push(resp);
             }             
             res.json({success: true, data:response});
         }
     })
}
// ,
// analysis: function(text,callback){
//     var twitterClient = new twitter(config);
//     var response = [], dbData = []; // to store the tweets and sentiment
  
//     twitterClient.search(text, function(data) {
//       for (var i = 0; i < data.statuses.length; i++) {
//         var resp = {};
  
//         resp.tweet = data.statuses[i];
//         resp.sentiment = sentimentAnalysis(data.statuses[i].text);
//         dbData.push({
//           tweet: resp.tweet.text,
//           score: resp.sentiment.score
//         });
//         response.push(resp);
//       };
//       db.sentiments.save(dbData);
//       callback(response);
//     });
// }

}
module.exports = functions;