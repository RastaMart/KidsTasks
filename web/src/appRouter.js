import React, { Component } from 'react';

import { Router, Route, IndexRoute, browserHistory } from 'react-router';


import App from './app/'
import Home from './pages/home'
import My from './pages/my'


class AppRouter extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="/my" component={My}></Route>
        </Route>
      </Router>
    );
  }
}

export default AppRouter;
