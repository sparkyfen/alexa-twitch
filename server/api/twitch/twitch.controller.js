'use strict';

var alexa = require('alexa-nodekit');

var twitch = require('../../components/twitch');
// Accept incoming Amazon Echo request.
// The Intent Request will be parsed for the Intent type and then forwarded to its proper function.
exports.index = function(req, res) {
  var sessionId;
  var userId;
  if(req.body.request.type === 'LaunchRequest') {
    alexa.launchRequest(req.body);
    // TODO For now, we don't care about the session or the user id, we will refactor this later.
    sessionId = alexa.sessionId;
    userId = alexa.userId;
    alexa.response('Welcome to the Twitch app, you can say things like is this streamer live, or how many viewers does streamer have.', {
      title: 'Alexa-Twitch',
      subtitle: 'Welcome to the Twitch app',
      content: 'Some commands are "Is summit1g live?" or "How many viewers does summit1g have?"'
    }, false, function (error, response) {
      if(error) {
        return res.status(500).jsonp({message: error});
      }
      return res.jsonp(response);
    });
  } else if(req.body.request.type === 'IntentRequest') {
    alexa.intentRequest(req.body);
    // TODO For now, we don't care about the session or the user id, we will refactor this later.
    sessionId = alexa.sessionId;
    userId = alexa.userId;
    var intent = alexa.intentName;
    var slots = alexa.slots;
    if(intent === 'GetUserLive') {
      twitch.checkUserLive(slots, function (error, isLive) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not process intention.'});
        }
        if(isLive) {
          alexa.response('The streamer ' + slots.Streamer.value + ' is live.', {
            title: 'Alexa-Twitch',
            subtitle: 'Stream is live',
            content: 'The streamer ' + slots.Streamer.value + ' is live.'
          }, false, function (error, response) {
            if(error) {
              return res.status(500).jsonp(error);
            }
            return res.jsonp(response);
          });
        } else {
          alexa.response('The streamer ' + slots.Streamer.value + ' is offline.', {
            title: 'Alexa-Twitch',
            subtitle: 'Stream is offline',
            content: 'The streamer ' + slots.Streamer.value + ' is offline.'
          }, false, function (error, response) {
            if(error) {
              return res.status(500).jsonp(error);
            }
            return res.jsonp(response);
          });
        }
      });
    } else if(intent === 'GetViewerCount') {
      twitch.getViewerCount(slots, function (error, viewerCount) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not process intention.'});
        }
        alexa.response('The view count for streamer ' + slots.Streamer.value + ' is ' + viewerCount, {
          title: 'Alexa-Twitch',
          subtitle: slots.Streamer.value + ' - ' + viewerCount + ' view count.',
          content: 'The view count for streamer ' + slots.Streamer.value + ' is ' + viewerCount
        }, false, function (error, response) {
          if(error) {
            return res.status(500).jsonp(error);
          }
          return res.jsonp(response);
        });
      });
    } else {
      alexa.response('Unknown intention, please try a different command.', {
        title: 'Alexa-Twitch',
        subtitle: 'Unknown intention.',
        content: 'Unknown intention, please try a different command.'
      }, false, function (error, response) {
        if(error) {
          return res.status(500).jsonp(error);
        }
        return res.jsonp(response);
      });
    }
  } else {
    alexa.sessionEndedRequest(req.body);
    // TODO For now, we don't care about the session or the user id, we will refactor this later.
    sessionId = alexa.sessionId;
    userId = alexa.userId;
    var sessionEndReason = alexa.reason;
    alexa.response(function (error, response) {
      if(error) {
        return res.status(500).jsonp(error);
      }
      return res.jsonp(response);
    });
  }
};