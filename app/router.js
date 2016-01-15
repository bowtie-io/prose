var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');

var User = require('./models/user');
var Users = require('./collections/users');
var Orgs = require('./collections/orgs');
var Repos = require('./collections/repos');

var Repo = require('./models/repo');
var File = require('./models/file');

var AppView = require('./views/app');
var NotificationView = require('./views/notification');
var StartView = require('./views/start');
var ProfileView = require('./views/profile');
var SearchView = require('./views/search');
var ReposView = require('./views/repos');
var RepoView = require('./views/repo');
var FileView = require('./views/file');
var DocumentationView = require('./views/documentation');
var ChooseLanguageView = require('./views/chooselanguage');

var templates = require('../dist/templates');
var util = require('./util');
var auth = require('./config');
var cookie = require('./cookie');

// Set scope
auth.scope = cookie.get('scope') || 'repo';

module.exports = Backbone.Router.extend({

  routes: {
    '(/)': 'project',
    'about(/)': 'about',
    'chooselanguage(/)': 'chooseLanguage',
    '*path(/)': 'path'
  },

  initialize: function(options) {
    options = _.clone(options) || {};

    if (!options.user){
      throw "`options` must include `user`";
    }

    if (!options.repo){
      throw "`options` must include `repo`";
    }

    this.models = {
      user: options.user,
      users: (new Users([options.user])),
      repo: options.repo,
      repos: (new Repos([options.repo], { user: options.user })),
      orgs: (new Orgs([], { user: options.user }))
    };

    // Load up the main layout
    this.app = new AppView({
      el: '#prose',
      model: {},
      user: this.models.user
    });

    this.app.render();
    this.app.loader.done();
  },

  chooseLanguage: function() {
    if (this.view) this.view.remove();

    this.app.loader.start(t('loading.file'));
    this.app.nav.mode('');

    this.view = new ChooseLanguageView();
    this.app.$el.find('#main').html(this.view.render().el);

    this.app.loader.done();
  },

  about: function() {
    if (this.view) this.view.remove();

    this.app.loader.start(t('loading.file'));
    this.app.nav.mode('');

    this.view = new DocumentationView();
    this.app.$el.find('#main').html(this.view.render().el);

    this.app.loader.done();
  },

  project: function(branch, path){
    if (this.view) this.view.remove();

    var user = this.models.user,
        repo = this.models.repo;

    this.app.nav.mode('repo');

    var title = repo.name;
    if (branch) title = '/' + path + ' at ' + branch;
    util.documentTitle(title);

    var content = new RepoView({
      app: this.app,
      branch: branch,
      model: repo,
      nav: this.app.nav,
      path: path,
      router: this,
      sidebar: this.app.sidebar
    });

    this.view = content;
    this.app.$el.find('#main').html(this.view.render().el);
  },

  path: function(path) {
    var url = util.extractURL(path);

    switch(url.mode) {
      case 'tree':
        this.project(url.branch, url.path);
        break;
      case 'new':
      case 'blob':
      case 'edit':
      case 'preview':
        this.post(url.mode, url.branch, url.path);
        break;
      default:
        throw url.mode;
    }
  },

  post: function(mode, branch, path) {
    if (this.view) this.view.remove();

    this.app.nav.mode('file');

    switch(mode) {
      case 'new':
        this.app.loader.start(t('loading.creating'));
        break;
      case 'edit':
        this.app.loader.start(t('loading.file'));
        break;
      case 'preview':
        this.app.loader.start(t('loading.preview'));
        break;
    }

    var user = this.models.user;
    var repo = this.models.repo;

    var file = {
      app: this.app,
      branch: branch,
      branches: repo.branches,
      mode: mode,
      nav: this.app.nav,
      name: util.extractFilename(path)[1],
      path: path,
      repo: repo,
      router: this,
      sidebar: this.app.sidebar
    };

    this.view = new FileView(file);
    this.app.$el.find("#main").html(this.view.el);
    this.app.loader.done();
  },

  notify: function(message, error, options) {
    if (this.view) this.view.remove();

    this.view = new NotificationView({
      'message': message,
      'error': error,
      'options': options
    });

    this.app.$el.find('#main').html(this.view.render().el);
    this.app.loader.stop();
  },

  error: function(xhr) {
    var message = [
      xhr.status,
      xhr.statusText
    ].join(' ');

    var error = util.xhrErrorMessage(xhr);

    var options = [
      {
        'title': t('notification.home'),
        'link': '/'
      }
    ];

    if (xhr.status === 404 && !this.user) {
      error = t('notification.404');
      options.unshift({
        'title': t('login'),
        'link': auth.site + '/login/oauth/authorize?client_id=' +
          auth.id + '&scope=' + auth.scope + '&redirect_uri=' +
          encodeURIComponent(window.location.href)
      });
    }

    this.notify(message, error, options);
  }
});
