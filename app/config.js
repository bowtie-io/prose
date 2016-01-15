var cookie = require('./cookie');
var oauth = require('../oauth.json');

module.exports = {
  api: oauth.api || 'https://api.bowtie.io',
  apiStatus: oauth.status || 'https://api.bowtie.io/status',
  site: oauth.site || 'https://github.com',
  id: oauth.clientId,
  username: oauth.user || cookie.get('username'),
  type: oauth.type || 'oauth'
};
