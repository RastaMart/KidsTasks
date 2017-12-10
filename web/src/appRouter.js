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
import AddFamillyMember from './pages/addFamillyMember'
import JoinFamilly from './pages/joinFamilly'


class AppRouter extends Component {

  constructor() {
    super();
    this.firstLoad = true;
    this.state = {
      fbUser: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.fbUserListener = _const.fbAuth.onAuthStateChanged((fbUser) => {

      if (fbUser) {
        this.uid = fbUser.uid;
        this.userRef = _const.fbDb.ref().child('users').child(this.uid);
        this.userRef.on('value', userSnap => {
          let user = userSnap.val();

          this.setState({
            fbUser: fbUser,
            user:user,
            loading: false,
          });
          if(this.firstLoad) {
            this.firstLoad = false;
            this.updateProfilePict(fbUser.providerData[0].photoURL);
          }
        });


      } else {
        this.setState({
          fbUser: null,
          user: null,
          loading: false
        })
      }
    })
  }
  componentWillUnmount() {
    this.fbUserListener.off();
  }

  updateProfilePict(profilePictUrl) {
    var img = new Image(),
    canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");
    //src = "http://example.com/image"; // insert image url here
    img.crossOrigin = "Anonymous";
    img.onload = ()=> {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage( img, 0, 0 );
      canvas.toBlob((blob) => {
        this.saveProfilePict(blob);
      }, "image/jpeg", 1);
      
    }
    img.src = profilePictUrl;
  }
  saveProfilePict(blob) {
        var storageRef = firebase.storage().ref();
        var userProfilePictRef = storageRef.child('profilePict/' + this.uid + '.jpg')

        userProfilePictRef.put(blob).then((snapshot) => {
          this.userRef.update({pictUrl:snapshot.downloadURL});
        });
  }

  render() {
    return (
      (this.state.loading) ? <div>Loading...</div> : (
        <BrowserRouter>
          <App fbUser={this.state.fbUser} user={this.state.user}>
            <Switch>
              <Route path='/' exact component={Home} />

              <PublicRoute fbUser={this.state.fbUser} user={this.state.user} path='/login' component={Login} />
              <PrivateRoute fbUser={this.state.fbUser} user={this.state.user} path="/list" component={List} />
              <PrivateRoute fbUser={this.state.fbUser} user={this.state.user} path="/templates" component={Templates} />
              <PrivateRoute fbUser={this.state.fbUser} user={this.state.user} path="/profil" component={Profil} />
              <PrivateRoute fbUser={this.state.fbUser} user={this.state.user} path="/addFamillyMember" component={AddFamillyMember} />
              <PrivateRoute fbUser={this.state.fbUser} user={this.state.user} path="/joinFamilly" component={JoinFamilly} />

              <Route render={() => <h3>Not found...</h3>} />

            </Switch>
          </App>
        </BrowserRouter>
      )
    );
  }
}

function PrivateRoute({ component: Component, fbUser, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => fbUser !== null
        ? <Component fbUser={fbUser} user={user} {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}

function PublicRoute({ component: Component, fbUser, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => <Component {...props} />}
    />
  )
}
export default AppRouter;
