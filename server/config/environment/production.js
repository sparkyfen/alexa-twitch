'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080,
  twitch: {
    client_id: process.env.HEROKU_TWITCH_CLIENT_ID || ''
  }
};