var express = require('express');

var app = express();

var bodyParser = require('body-parser');
var jsonencode = bodyParser.json();

app.use(express.static('app'));

// Redis connection
var redis = require('redis');
if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
} else {
    var client = redis.createClient();
}
// End redis connection

// perhaps move all this init param stuff to separate script to only run once.
client.hset('new_propositions', 'newProp1' , {url: 'www.google.com', description: 'search engine', email: 'tor@gmail.com'});

client.hset( 'session0','choice1' , {proposition: 1, choice: 0});
client.hset( 'session0','choice2' , {proposition: 2, choice: 1});

client.hset( 'session1','choice1' , {proposition: 2, choice: 1});
client.hset( 'session1','choice2' , {proposition: 4, choice: 1});

client.hset('propositions','numProps',6);
client.hset('sessions','numSessions',0);

app.get('/init', function(request,response){
    var tempNumProps;
    var tempSession;
    client.hget('propositions','numProps',function(error,numProps){
      tempNumProps = numProps;
    });
    client.hget('sessions','numSessions',function(error,numSessions){
      tempSession = (parseInt(numSessions)+1); 
      var params = {sessionID: tempSession, numProps: tempNumProps};
      response.json(params);
      client.hset('sessions','numSessions',tempSession);    
    });
    

});

app.post('/new_proposition', jsonencode, function(request,response){
    client.hkeys('new_propositions',function(error,newProps){
      var newPropNum = newProps.length;
      var newProp = 'newProp' + (newPropNum + 1);
      client.hset('new_propositions',newProp,JSON.stringify(request.body));
      response.sendStatus(201);
    });
});

app.post('/prediction', jsonencode, function(request,response){
       response.send('+4 to genius you suave nerd baller you on session: ' + request.body.sessionID);
});

app.post('/new_choice', jsonencode, function(request,response){
    var sessionID = 'session' + request.body.sessionID;
    var propArray = request.body.proposition;
    var propImage = propArray.split('/')[2];
    var propositionID = parseInt(propImage.substr(4,propImage.length-8));
    var sessionEntry = {proposition: propositionID, choice: parseInt(request.body.choice)};

    client.hkeys(sessionID,function(error,choices){
        if (choices.length != 0) {
            var newChoice = 'choice' + (choices.length+1);
            client.hset(sessionID,newChoice , JSON.stringify(sessionEntry));
        } else {
            client.hset(sessionID, 'choice1' , JSON.stringify(sessionEntry));  
        } 
    });
    response.sendStatus(201);
});
// when session closes, if fewer than n entries, perhaps delete session
module.exports = app;

