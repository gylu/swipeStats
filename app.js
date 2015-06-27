var express = require('express');

var app = express();

var bodyParser = require('body-parser');
var jsonencode = bodyParser.json();

app.use(express.static('app'));

var new_propositions = [{url: 'www.google.com', description: 'search engine', email: 'tor@gmail.com'}];

var choices = {session0: [{proposition: 1, choice: 0}, {proposition: 2, choice: 1}],
               session1: [{proposition: 2, choice: 1}, {proposition: 4, choice: 1}]}; 

app.get('/init', function(request,response){
    var params = {sessionID: 2, numProps: 5};
    response.json(params);
});

app.post('/new_proposition', jsonencode, function(request,response){
    new_propositions.push(request.body);
    response.sendStatus(201);
});

app.post('/new_choice', jsonencode, function(request,response){
    var sessionID = 'session' + request.body.sessionID;
    var propArray = request.body.proposition;
    var propImage = propArray.split('/')[2];
    var propositionID = parseInt(propImage.substr(4,propImage.length-8));
    var sessionEntry = {proposition: propositionID, choice: parseInt(request.body.choice)};
    if (choices.hasOwnProperty(sessionID)) {
        choices[sessionID].push(sessionEntry);
    } else {
       choices[sessionID] = [sessionEntry];
    }
    if (choices[sessionID].length % 5 == 0) {  
       response.send('+4 to genius you suave nerd baller you on session: ' + request.body.sessionID);
    } else {
       response.sendStatus(201);    
    }

});
// when session closes, if fewer than n entries, perhaps delete session
module.exports = app;

