import React, { Component } from 'react';
//import * as firebase from 'firebase';

import QrReader from 'react-qr-reader';

import _const from '../../const';

import './index.css';

class AddFamillyMember extends Component {

  constructor(props) {
    super(props);

    this.uid = this.props.fbUser.uid;

    this.state = {
      loading: true,
      delay: 300,
      searchForPIN:false,
      PINFounded:false,
      PIN:'',
      famillyId: null,
      famillyLabel:null,
      camAvailable:true,
      requestSent:false,
      err:''
    };
    this.handlePinFieldChange = this.handlePinFieldChange.bind(this);
  }

  componentDidMount() {

    let _theDate = new Date();

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
          loading: false,
          user: user,
        });
    });

  }
  handleScan(data){
    if(data){
      this.setState({
        famillyId: data,
      }, ()=>{this.PINMatch();})
    }
  }
  handleScanError(err){
    this.setState({
      camAvailable:false
    });
  }
  handlePinFieldChange(event) {
    var _PIN = event.target.value;
    this.setState({PIN: _PIN});
    if(_PIN.length===6) {
      this.searchForPIN(_PIN);
    }
  }
  searchForPIN(PIN) {
    this.setState({
      searchForPIN:true
    });
    this.PINRef.child(PIN).on('value', (PINSnap) => {
      var _matchingPINFamillyId = PINSnap.val();
      if(_matchingPINFamillyId) {
        this.setState({
          searchForPIN:false,
          famillyId : _matchingPINFamillyId
        }, ()=>{
          this.PINMatch();
        });
      } else {
        this.setState({
          searchForPIN:false,
          famillyId : null
        });
      }
    });
  }
  PINMatch() {
    //this.familliesRef = _const.fbDb.ref().child('famillies');
    this.famillyRef = this.familliesRef.child(this.state.famillyId);

    var addPending = true;

    this.famillyRef.on('value', (famillySnap) => {
      var _familly = famillySnap.val();
      
      this.setState({
        famillyLabel : _familly.label
      });

      if(addPending) {
        addPending = false;
        var _data = {};
        _data[this.uid] = this.state.user;
        this.famillyRef.child('pending_' + this.state.user.familyMemberType + 's').update(_data);

        _data = {};
        _data[this.state.famillyId] = {
          label:_familly.label,
          approve:null
        };
        this.userRef.child('pending_famillies').update(_data);


        this.setState({
          requestSent:true,
          PIN:'',
          famillyId: null,
          famillyLabel:null,
        });
      }
    });
  }
  deleteRequest(famillyId, redirectAfter) {
    var _data = {};
    _data[famillyId] = null;
    this.userRef.child('pending_famillies').update(_data);
    if(redirectAfter) {
      this.props.history.push("/Profil");
    }
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
            this.state.loading ? <div>Loading...</div> : 
              <div>
                {this.renderPendingsRequests()}
                {

                  (this.state.famillyId) ?
                    this.renderFamillyMatch() :
                    (this.state.camAvailable) ?
                      this.renderQrCodeReader() :
                      this.renderPINDOM()
                }
              </div>
          }
        </div>
      </div>
    );
  }
  renderPendingsRequests() {
    return(
      <div>
        {
          (this.state.user.pending_famillies) ? 
            <div>
              <p>Demande(s) en attente(s) d'approbation</p>
              {
                Object.keys(this.state.user.pending_famillies).map((famillyKey) => {
                  var pendingFamilly = this.state.user.pending_famillies[famillyKey];
                  return(
                    <div key={famillyKey} className="pendingFamilly">
                    <p>{pendingFamilly.label}</p>
                    {
                      (pendingFamilly.approve==null) ? 
                        <p>en attente</p> :
                        (pendingFamilly.approve) ? 
                        <p>approuvée <button onClick={this.deleteRequest.bind(this, famillyKey, true)}>ok</button></p> : 
                        <p>refusée <button onClick={this.deleteRequest.bind(this, famillyKey, false)}>effacer</button></p>
                    }
                    </div>
                  );
                })
              }
              <p>---</p>
            </div>
            :
            <div></div>
        }
      </div>
    );
  }
  renderQrCodeReader() {
    return (
      <div>
        <QrReader
          delay={this.state.delay}
          onError={this.handleScanError.bind(this)}
          onScan={this.handleScan.bind(this)}
          style={{ width: '100%' }}
          />
      </div>
    );
  }
  renderPINDOM() {
    return (
      <div>
        <p>Entrer le code à 6 chiffres affiché sur l'appareil du gestionnaire de la famille</p>
        {
          (!this.state.searchForPIN && !this.state.PINFounded) ?
          <div>
            <input id="PINField" type="text" value={this.state.PIN} onChange={this.handlePinFieldChange} />
            {(this.state.PIN.length === 6)? <p>Code non valide</p> :''}
          </div>
          :
          
          (this.state.searchForPIN) ?
          <div>
            <p>{this.state.PIN}</p>
            <p>Validation du code</p>
          </div>
          :
          <p>Code validé!</p>
          
        }
        
      </div>

    );
  }
  renderFamillyMatch() {
    return(
      <div>
        {
          (this.state.requestSent) ? 
            <div>
              <p>Votre demande est envoyé.</p>
              <p>Un des parents de la famille peut maintenant approuver votre demande.</p>
            </div>
          :
            (!this.state.famillyLabel) ? 
            <div>
              <p>Recherche de la famille correspondante au code</p>
              <p>{this.state.famillyId}</p>
            </div>
            : 
            <div>
              <p>Envoie d'une demande pour joindre la famille :</p>
              <p>{this.state.famillyId}</p>
              <p className="famillyLabel">{this.state.famillyLabel}</p>
              <p>Patientez quelques instants s.v.p.</p>
            </div>
        }
      </div>
    );
  }
}

export default AddFamillyMember;
