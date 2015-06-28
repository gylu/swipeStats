var request = require('supertest');
var app = require('./app');

describe('Requests to the root path', function() {

  it('Returns a 200 status code', function(done) {
      request(app)
          .get('/')
          .expect(200,done);
  });
  it('Returns a HTML format', function(done) {
      request(app)
          .get('/')
          .expect('Content-Type', /html/, done);
  });

});

describe('Initial server query on /init', function(){
    it('Returns 200 status code', function(done) {
      request(app)
        .get('/init')
        .expect(200,done);
    });
    
    it('Returns json format', function(done) {
      request(app)
        .get('/init')
        .expect('Content-Type', /json/,done);
    });
    it('Returns initial cities', function(done) {
      request(app)
        .get('/init')
        .expect(JSON.stringify({sessionID: 2,numProps: 5}),done);      
    });
    
});

describe('Submitting new proposition', function() {

    it('Returns a 201 status code', function(done){
      request(app)
        .post('/new_proposition')
        .send({description: 'where the simpsons live',email: 'joebob@munzer.com',url: 'www.donger.com'})
        .expect(201,done);
    });
});

describe('Ask for new prediction', function() {
    it('Returns a 200 status code', function(done){
      request(app)
        .post('/prediction')
        .send({sessionID: 2})
        .expect(200,done);
    });
    it('Returns baller message', function(done){
      request(app)
        .post('/prediction')
        .send({sessionID: 2})
        .expect('+4 to genius you suave nerd baller you on session: 2',done)
    });
});
