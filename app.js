var express = require('express');
var app = express();

app.use(express.static('app'));

app.get('/init', function(request,response){
    var params = {sessionID: 1, numProps: 5};
    response.json(params);
});

module.exports = app;

