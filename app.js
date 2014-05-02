'use strict';
var page = require('page');
var request = require('superagent');
var mustache = require('mustache');

var content = document.querySelector('#content');

var listTemplate =
  '<h1>Early GitHub Users</h1>' +
  '<ul>' +
    '{{#.}}' +
    '<li>' +
      '<a href="/user/{{id}}">{{login}}</a>' +
    '</li>' +
    '{{/.}}' +
  '</ul>';

var showTemplate =
  '<h1>User {{login}}</h1>' +
  '<p>{{name}} is user number {{id}}.' +
  'He has {{followers}} followers, ' +
  '{{public_repos}} public repos and writes a blog at' +
  '<a href="{{blog}}">{{blog}}</a>.' +
  '<a href="/">Back to list</a>.</p>';

page('/', loadUsers, showUsers);
page('/user/:id', loadUser, showUser);
page.start();

function loadUsers (ctx, next) {
  if (ctx.state.users) {
    // cache hit!
    next();
  } else {
    // not cached; make the request
    request('https://api.github.com/users', function (res) {
      var users = res.body;
      ctx.state.users = users;
      ctx.save();
      next();
    });
  }
}

function loadUser (ctx, next) {
  if (ctx.state.user) {
    next();
  } else {
    var id = ctx.params.id;
    request('https://api.github.com/user/' + id, function (res) {
      var user = res.body;
      ctx.state.user = user;
      ctx.save();
      next();
    });
  }
}

function showUsers (ctx) {
  var users = ctx.state.users;
  content.innerHTML = mustache.render(listTemplate, users);
}

function showUser (ctx) {
  var user = ctx.state.user;
  content.innerHTML = mustache.render(showTemplate, user);
}
