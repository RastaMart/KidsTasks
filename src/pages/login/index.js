import React, { Component } from 'react';
//import * as firebase from 'firebase';
//import firebaseui from 'firebaseui';

import _const from '../../const';

import '../../../node_modules/firebaseui/dist/firebaseui.css';

class Login extends Component {
  constructor() {
    super();

    this.state = { loginMessage: null }
  }
  
  

  componentDidMount() {

      // The start method will wait until the DOM is loaded.
      _const.fbUi.start('#firebaseui-auth-container', _const.fbUiConfig);
  }
  componentWillUnMount() {
    //his.fbUi = null;
  }

  render() {
    return (
      <div>
{/*            <link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/1.0.1/firebaseui.css" />
*/}
        <h1> Login </h1>
        <div id="firebaseui-auth-container"></div>
      </div>
    );
  }
}

export default Login;
