var express = require('express');

var app = express();

var bodyParser = require('body-parser');
var jsonencode = bodyParser.json();

app.use(express.static('app'));

var new_propositions = [{url: 'www.google.com', description: 'search engine', email: 'tor@gmail.com'}];

app.get('/init', function(request,response){
    var params = {sessionID: 1, numProps: 5};
    response.json(params);
});

app.post('/new_proposition', jsonencode, function(request,response){
    new_propositions.push(request.body);
    response.sendStatus(201);
});

module.exports = app;

