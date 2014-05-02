/** @jsx React.DOM */
'use strict';

var React = require('react');
var request = require('superagent');

var ListUsers = React.createClass({
  render: function () {
    var users = this.props.users.map(function (user) {
      return (
        <li><a href={'/user/' + user.id}>{user.login}</a></li>
      );
    });
    return (
      <div class="content">
        <h1>Early GitHub Users</h1>
        <ul>{users}</ul>
      </div>
    );
  }
});

var ShowUser = React.createClass({
  render: function () {
    var user = this.props.user;
    return (
      <div class="content">
        <h1>User {user.login}</h1>
        <p>{user.name} is user number {user.id}.</p>
        <p>He has {user.followers} followers, {user.public_repos} public repos and writes a blog at <a href={user.blog}>{user.blog}</a>.</p>
        <p><a href="/">Back to list</a>.</p>
      </div>
    )
  }
});

var App = React.createClass({
  getInitialState: function () {
    return {
      page: <div/>
    };
  },
  componentDidMount: function () {
    this.page = require('page');
    this.page('/', this.loadUsers);
    this.page('/user/:id', this.loadUser);
    this.page();
  },
  componentWillUnmount: function () {
    this.page.stop();
  },
  loadUsers: function (ctx) {
    if (!ctx.state.users) {
      // not cached; make the request
      request('https://api.github.com/users', function (res) {
        var users = res.body;
        ctx.state.users = users;
        ctx.save();
        this.setState({
          users: users,
          page: <ListUsers users={users}/>
        });
      }.bind(this));
    }
  },
  loadUser: function (ctx) {
    if (!ctx.state.user) {
      var id = ctx.params.id;
      request('https://api.github.com/user/' + id, function (res) {
        var user = res.body;
        ctx.state.user = user;
        ctx.save();
        this.setState({
          user: user,
          page: <ShowUser user={user}/>
        });
      }.bind(this));
    }
  },
  render: function () {
    return this.state.page;
  }
});

React.renderComponent(<App/>, document.body);
