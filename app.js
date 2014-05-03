/** @jsx React.DOM */
'use strict';

var React = require('react');
var request = require('superagent');

var ListUsers = React.createClass({
  render: function () {
    var users = this.props.users.map(function (user) {
      return (
        <li key={'user' + user.id}><a href={'/user/' + user.id}>{user.login}</a></li>
      );
    });
    return (
      <div className="content">
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
      <div className="content">
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
      user: {},
      page: null
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
    if (!this.state.users) {
      // not cached; make the request
      request('https://api.github.com/users', function (res) {
        var users = res.body;
        this.setState({
          params: ctx.params,
          users: users,
          page: 'list'
        });
      }.bind(this));
    } else {
      this.setState({
        params: ctx.params,
        page: 'list'
      });
    }
  },
  loadUser: function (ctx) {
    var id = ctx.params.id;
    if (!this.state.user[id]) {
      request('https://api.github.com/user/' + id, function (res) {
        var user = this.state.user;
        var info = res.body;
        user[id] = info;
        this.setState({
          params: ctx.params,
          user: user,
          page: 'show'
        });
      }.bind(this));
    } else {
      this.setState({
        params: ctx.params,
        page: 'show'
      });
    }
  },
  render: function () {
    switch (this.state.page) {
    case 'list':
      return <ListUsers users={this.state.users}/>;
    case 'show':
      return <ShowUser user={this.state.user[this.state.params.id]}/>;
    default:
      return <div/>
    };
  }
});

React.renderComponent(<App/>, document.body);
