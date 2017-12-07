import React, { Component } from 'react';
//import * as firebase from 'firebase';

import QRCode from 'react-qr-code';

import _const from '../../const';

import './index.css';

class AddFamillyMember extends Component {

  constructor(props) {
    super(props);

    this.uid = this.props.user.uid;

    this.state = {
      loading: true,
    };

  }

  componentDidMount() {    
    
    console.log('this.uid', this.uid);
    this.usersRef = _const.fbDb.ref().child('users');
    this.userRef = this.usersRef.child(this.uid);
    this.familliesRef = _const.fbDb.ref().child('famillies');
    this.famillyRef = null;
  
    this.userRef.on('value', userSnap => {
      let user = userSnap.val();

        this.setState({
          loading: false,
          user: user
        });
        console.log('user', user);
    });
  }

  componentWillUnmount() {
    //
  }

  render() {
    return (
      <div id="joinFamilly">
        <div className="header">
          <h1>Joindre une famille</h1>
        </div>
        <div className="content">
          {
            this.state.loading ? <div>Loading...</div>
              :
              <div>
                {/* <p>{this.state.user.famillies[0]}</p>
                <QRCode value={this.state.user.famillies[0]} /> */}

              </div>
          }
        </div>
      </div>
    );
  }
}

export default AddFamillyMember;
