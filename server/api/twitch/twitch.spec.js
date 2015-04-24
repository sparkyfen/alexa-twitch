'use strict';

var should = require('should');
var fs = require('fs');
var app = require('../../app');
var request = require('supertest');

var nock = require('nock');
nock.enableNetConnect();

describe('POST /api/twitch', function() {

  describe('Launch Request', function () {
    it('should successfully make a launch request', function (done) {
      request(app)
      .post('/api/twitch')
      .send({
        "version": "1.0",
        "session": {
          "new": true,
          "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
          "attributes": {},
          "user": {
            "userId": "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2"
          }
        },
        "request": {
          "type": "LaunchRequest",
          "requestId": "amzn1.echo-api.request.9cdaa4db-f20e-4c58-8d01-c75322d6c423"
        }
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('version', '1.0');
        res.body.response.outputSpeech.should.have.property('text', 'Welcome to the Twitch app, you can say things like is this streamer live, or how many viewers does streamer have.');
        res.body.response.card.should.have.property('content', 'Some commands are "Is summit1g live?" or "How many viewers does summit1g have?"');
        done();
      });
    });
  });

  describe('Intent Request', function () {
    var streamer = 'summit1g';
    it('should successfully make a GetUserLive intent request with a live user', function (done) {
      nock('https://api.twitch.tv')
      .get('/kraken/streams/' + streamer)
      .reply(200, function (uri, requestBody) {
        return fs.createReadStream(__dirname + '/summit_success.json');
      });
      request(app)
      .post('/api/twitch')
      .send({
        "version": "1.0",
        "session": {
          "new": false,
          "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
          "attributes": {},
          "user": {
            "userId": "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2"
          }
        },
        "request": {
          "type": "IntentRequest",
          "requestId": " amzn1.echo-api.request.6919844a-733e-4e89-893a-fdcb77e2ef0d",
          "intent": {
            "name": "GetUserLive",
            "slots": {
              "Streamer": {
                "name": "Streamer",
                "value": streamer
              }
            }
          }
        }
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('version', '1.0');
        res.body.response.outputSpeech.should.have.property('text', 'The streamer ' + streamer + ' is live.');
        res.body.response.card.should.have.property('content', 'The streamer ' + streamer + ' is live.');
        done();
      });
    });
    it('should successfully make a GetUserLive intent request with an offline user', function (done) {
      nock('https://api.twitch.tv')
      .get('/kraken/streams/' + streamer)
      .reply(200, function (uri, requestBody) {
        return fs.createReadStream(__dirname + '/summit_fail.json');
      });
      request(app)
      .post('/api/twitch')
      .send({
        "version": "1.0",
        "session": {
          "new": false,
          "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
          "attributes": {},
          "user": {
            "userId": "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2"
          }
        },
        "request": {
          "type": "IntentRequest",
          "requestId": " amzn1.echo-api.request.6919844a-733e-4e89-893a-fdcb77e2ef0d",
          "intent": {
            "name": "GetUserLive",
            "slots": {
              "Streamer": {
                "name": "Streamer",
                "value": streamer
              }
            }
          }
        }
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('version', '1.0');
        res.body.response.outputSpeech.should.have.property('text', 'The streamer ' + streamer + ' is offline.');
        res.body.response.card.should.have.property('content', 'The streamer ' + streamer + ' is offline.');
        done();
      });
    });
    it('should successfully make a GetViewerCount intent request on a live user', function (done) {
      nock('https://api.twitch.tv')
      .get('/kraken/streams/' + streamer)
      .reply(200, function (uri, requestBody) {
        return fs.createReadStream(__dirname + '/summit_success.json');
      });
      request(app)
      .post('/api/twitch')
      .send({
        "version": "1.0",
        "session": {
          "new": false,
          "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
          "attributes": {},
          "user": {
            "userId": "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2"
          }
        },
        "request": {
          "type": "IntentRequest",
          "requestId": " amzn1.echo-api.request.6919844a-733e-4e89-893a-fdcb77e2ef0d",
          "intent": {
            "name": "GetViewerCount",
            "slots": {
              "Streamer": {
                "name": "Streamer",
                "value": streamer
              }
            }
          }
        }
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('version', '1.0');
        res.body.response.outputSpeech.should.have.property('text', 'The view count for streamer summit1g is 18443');
        res.body.response.card.should.have.property('content', 'The view count for streamer summit1g is 18443');
        done();
      });
    });
    it('should successfully make a GetViewerCount intent request on an offline user', function (done) {
      nock('https://api.twitch.tv')
      .get('/kraken/streams/' + streamer)
      .reply(200, function (uri, requestBody) {
        return fs.createReadStream(__dirname + '/summit_fail.json');
      });
      request(app)
      .post('/api/twitch')
      .send({
        "version": "1.0",
        "session": {
          "new": false,
          "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
          "attributes": {},
          "user": {
            "userId": "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2"
          }
        },
        "request": {
          "type": "IntentRequest",
          "requestId": " amzn1.echo-api.request.6919844a-733e-4e89-893a-fdcb77e2ef0d",
          "intent": {
            "name": "GetViewerCount",
            "slots": {
              "Streamer": {
                "name": "Streamer",
                "value": streamer
              }
            }
          }
        }
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('version', '1.0');
        res.body.response.outputSpeech.should.have.property('text', 'The view count for streamer summit1g is 0');
        res.body.response.card.should.have.property('content', 'The view count for streamer summit1g is 0');
        done();
      });
    });
  });

  describe('Session Ended Request', function () {
    it('should successfully make a session ended request', function (done) {
      request(app)
      .post('/api/twitch')
      .send({
        "version": "1.0",
        "session": {
          "new": false,
          "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
          "attributes": {},
          "user": {
            "userId": "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2"
          }
        },
        "request": {
          "type": "SessionEndedRequest",
          "requestId": "amzn1.echo-api.request.d8c37cd6-0e1c-458e-8877-5bb4160bf1e1",
          "reason": "USER_INITIATED"
        }
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('version', '1.0');
        done();
      });
    });
  });
});