import React, { Component } from 'react';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom'
import * as firebase from 'firebase';

import _const from './const';

/*import Login from '../components/login';*/
import App from './app/'
import Home from './pages/home'

import Login from './pages/login'

import List from './pages/list'
import Templates from './pages/templates'
import Profil from './pages/profil'




class AppRouter extends Component {

  constructor() {
    super();
    this.state = {
      user: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.userListener = _const.fbAuth.onAuthStateChanged((user) => {

      if (user) {
        this.setState({
          user: user,
          loading: false,
        }, () => {
          let btnLogout = document.getElementById('logoutBtn');
          if (btnLogout) {
            btnLogout.addEventListener('click', e => {
              firebase.auth().signOut();
            });
          }
        })


      } else {
        this.setState({
          user: null,
          loading: false
        })
      }
    })
  }
  componentWillUnmount() {
    this.userListener.off();
  }


  render() {
    return (
      (this.state.loading) ? <div>Loading...</div> : (
        <BrowserRouter>
          <App user={this.state.user}>
            <Switch>
              <Route path='/' exact component={Home} />

              <PublicRoute user={this.state.user} path='/login' component={Login} />
              <PrivateRoute user={this.state.user} path="/list" component={List} />
              <PrivateRoute user={this.state.user} path="/templates" component={Templates} />
              <PrivateRoute user={this.state.user} path="/profil" component={Profil} />

              <Route render={() => <h3>Not found...</h3>} />

            </Switch>
          </App>
        </BrowserRouter>
      )
    );
  }
}

function PrivateRoute({ component: Component, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => user !== null
        ? <Component user={user} {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}

function PublicRoute({ component: Component, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => <Component {...props} />}
    />
  )
}
export default AppRouter;
