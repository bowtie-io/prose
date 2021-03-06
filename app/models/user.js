var $ = require('jquery-browserify');
var _ = require('underscore');

var Backbone = require('backbone');
var Repos = require('../collections/repos');
var Orgs = require('../collections/orgs');

// TODO Pass Notification view here if something goes wrong?
var NotificationView = require('../views/notification');

var auth = require('../config');
var cookie = require('../cookie');
var templates = require('../../dist/templates');

module.exports = Backbone.Model.extend({
  initialize: function(attributes, options) {
    this.repos = new Repos([], { user: this });
    this.orgs = new Orgs([], { user: this });
  },

  authenticate: function(options) {
    var match;

    if(auth.type == 'bowtie-v1') {
      bowtie.user.profile(function(profile){
        if(profile.key){
          auth.type = 'basic';
          auth.username = profile.key;
          auth.password = '';

          if (_.isFunction(options.success)) options.success();
        }else{
          if (_.isFunction(options.error)) options.error();
        }
      });
    } else if (cookie.get('oauth-token') || auth.type == 'basic') {
      if (_.isFunction(options.success)) options.success();
    } else {
      match = window.location.href.match(/\?code=([a-z0-9]*)/);

      if (match) {
        var ajax = $.ajax(auth.url + '/authenticate/' + match[1], {
          success: function(data) {
            cookie.set('oauth-token', data.token);

            var regex = new RegExp("(?:\\/)?\\?code=" + match[1]);
            window.location.href = window.location.href.replace(regex, '');

            if (_.isFunction(options.success)) options.success();
          }
        });
      } else {
        if (_.isFunction(options.error)) options.error();
      }
    }
  },

  url: function() {
    var id = cookie.get('id');
    var token = cookie.get('oauth-token');

    if(auth.type == 'basic'){
      return auth.api + '/user';

    }else{
      // Return '/user' if authenticated but no user id cookie has been set yet
      // or if this model's id matches authenticated user id
      return auth.api + ((token && _.isUndefined(id)) || (id && this.get('id') === id) ?
        '/user' : '/users/' + this.get('login'));
    }
  }
});
