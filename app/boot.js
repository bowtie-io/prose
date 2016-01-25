var LOCALES = require('../translations/locales');
var en = require('../dist/en.js');

// Set locale as global variable
window.locale.en = en;
window.locale.current('en');
window.app = {};
window.Backbone = Backbone;

var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
var Base64 = require('js-base64').Base64;

Backbone.$ = $;

var Router = require('./router');
var User = require('./models/user');
var Repo = require('./models/repo');
var NotificationView = require('./views/notification');
var config = require('./config');
var cookie = require('./cookie');
var auth = require('./config');
var status = require('./status');

// Set up translations
var setLanguage = (cookie.get('lang')) ? true : false;

// Check if the browsers language is supported
if (setLanguage) app.locale = cookie.get('lang');

if (app.locale && app.locale !== 'en') {
  $.getJSON('./translations/locales/' + app.locale + '.json', function(result) {
    window.locale[app.locale] = result;
    window.locale.current(app.locale);
  });
}

var user = new User({ });
var repo = new Repo({ });

user.authenticate({
  success: function() {
    if ('withCredentials' in new XMLHttpRequest()) {
      // Set OAuth header for all CORS requests
      $.ajaxSetup({
        headers: {
          'Authorization': config.auth === 'oauth' ?
            'token ' + cookie.get('oauth-token') :
            'Basic ' + Base64.encode(config.username + ':' + config.password)
        }
      });

      // Set an 'authenticated' class to #prose
      $('#prose').addClass('authenticated');

      $.when(user.fetch(), repo.fetch()).then(function(){
        window.router = new Router({ user: user, repo: repo });

        // Start responding to routes
        Backbone.history.start();
      }).fail(function(){
        var apiStatus = status.bowtieApi(function(res) {
          var error = new NotificationView({
            'message': t('notification.error.bowtie'),
            'options': [
              {
                'title': t('notification.back'),
                'link': '/'
              },
              {
                'title': t('notification.bowtieStatus', {
                  status: res.status
                }),
                'link': '//status.bowtie.io',
                'className': res.status
              }
            ]
          });

          $('#prose').html(error.render().el);
        });
      });
    } else {
      var upgrade = new NotificationView({
        'message': t('main.upgrade.content'),
        'options': [{
          'title': t('main.upgrade.download'),
          'link': 'https://www.google.com/intl/en/chrome/browser'
        }]
      });

      $('#prose').html(upgrade.render().el);
    }
  },
  error: function() {
    console.log("some error");

    // Initialize router
    window.router = new Router();

    // Start responding to routes
    Backbone.history.start();
  }
});
