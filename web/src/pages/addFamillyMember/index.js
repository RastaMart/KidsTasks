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

    let _theDate = new Date();
    let rndPIN = 0;
    while (rndPIN < 100000) {
      rndPIN = Math.round(Math.random()*1000000);
    }
    
    this.usersRef = _const.fbDb.ref().child('users');
    this.userRef = this.usersRef.child(this.uid);
    this.familliesRef = _const.fbDb.ref().child('famillies');
    this.famillyRef = null;
    this.PINRef = _const.fbDb.ref().child('PIN')
                    .child(_theDate.getFullYear())
                    .child(("00"+(_theDate.getMonth()+1))
                    .slice(-2)).child(("00"+_theDate.getDate()).slice(-2));


    this.userRef.on('value', userSnap => {
      let user = userSnap.val();

        this.setState({
          user: user
        });
        console.log('user', user);

        let _pin = {};
        _pin[rndPIN] = user.famillies[0];
        this.PINRef.update(_pin);

        this.famillyRef = this.familliesRef.child(user.famillies[0]);

        this.famillyRef.on('value', (famillySnap) => {
          var _familly = famillySnap.val();
          console.log('_familly', _familly);
          this.setState({
            familly:_familly
          });
        });
    });
    this.PINRef.child(rndPIN).on('value', pinSnap => {
      console.log('pinSnap.val()', pinSnap.val(), pinSnap.key);
        this.setState({
          rndPIN: rndPIN,
          loading: false
        });
    });
  }

  componentWillUnmount() {
    //
  }

  acceptRequest(userId, user, event) {
    console.log('acceptRequest', userId, event);
  }
  refuseRequest(userId, user, event) {
    console.log('refuseRequest', userId, event);
    
    var _data = {};
    _data[userId] = null;
    this.famillyRef.child('pending_'+user.familyMemberType+'s').update(_data);
  }

  render() {
    return (
      <div id="addFamillyMember">
        <div className="header">
          <h1>Ajouter un membre</h1>
        </div>
        <div className="content">
          {
            this.state.loading ? <div>Loading...</div>
              :
              <div>
                {this.renderPendingsRequests()}
                <p>Sur l'appareil de la personne à ajouter</p>
                <p>Scanner ce code :</p>
                <QRCode value={this.state.user.famillies[0]} />
                <p>- ou -</p>
                <p>Entrez ce code :</p>
                <p className="famillyCode">{this.state.rndPIN}</p>

              </div>
          }
        </div>
      </div>
    );
  }
  renderPendingsRequests() {
    if(this.state.familly) {
      return(
        <div>
          {
            !(this.state.familly.pending_parents || this.state.familly.pending_childs) ? '' :
            <h2>Demande(s) en attente(s) d'approbation :</h2>
          }
          {
            (!this.state.familly.pending_parents) ? '' :
            <div>
              
              {
                Object.keys(this.state.familly.pending_parents).map((userKey)=>{
                  console.log('userKey', userKey);
                  var user = this.state.familly.pending_parents[userKey];
                  console.log('user', user);
                  return this.renderPendingRequest(userKey, user);
                })
              }
            </div>
          }
          {
            (!this.state.familly.pending_childs) ? '' :
            Object.keys(this.state.familly.pending_childs).map((userKey)=>{
              console.log('userKey', userKey);
              var user = this.state.familly.pending_childs[userKey];
              return this.renderPendingRequest(userKey, user);
            })
          }
          {
            !(this.state.familly.pending_parents || this.state.familly.pending_childs) ? '' :
            <h2>Nouvelle demande :</h2>
          }
        </div>
      );
    }
  }
  renderPendingRequest(userId, user) {
    return(
      <div key={userId} className="pendingFamilly">
        {
          (user.pictUrl!=null)
          ?<img className='profilPict' src={user.pictUrl} alt={user.fullName} />
          :<img className='profilPict' src="/img/default_profile.png" alt={user.fullName} />
        }
        <p className="name">
          {user.fullName}
        </p>
        <button className="btn accept" onClick={this.acceptRequest.bind(this, userId, user)}>Accepter</button>
        <button className="btn refuse" onClick={this.refuseRequest.bind(this, userId, user)}>Refuser</button>
      </div>
    );
  }
}

export default AddFamillyMember;
