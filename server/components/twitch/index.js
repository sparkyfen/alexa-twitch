'use strict';

var TwitchClient = require('node-twitchtv');
var settings = require('../../config/environment');

var client = new TwitchClient(settings.twitchtv);

/**
 * Checks if a Twitch user is streaming now or not.
 *
 * @param  {Object} slots The Amazon Echo slots data.
 * @param  {Function} callback The callback function.
 * @return {Function} The callback function.
 */
exports.checkUserLive = function (slots, callback) {
  client.streams({
    channel: slots.Streamer.value,
  }, function (error, response) {
    if(error) {
      return callback(error);
    }
    if(!response.stream) {
      return callback(null, false);
    } else {
      return callback(null, true);
    }
  });
};

/**
 * Gets the viewer count for a given streamer.
 *
 * We will return 0 viewers if the stream is offline.
 *
 * @param  {Object} slots The Amazon Echo slots data.
 * @param  {Function} callback The callback function.
 * @return {Function} The callback function.
 */
exports.getViewerCount = function (slots, callback) {
  client.streams({
    channel: slots.Streamer.value
  }, function (error, response) {
    if(error) {
      return callback(error);
    }
    if(!response.stream) {
      return callback(null, 0);
    } else {
      return callback(null, response.stream.viewers);
    }
  });
};