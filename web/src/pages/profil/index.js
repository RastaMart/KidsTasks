import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase';

import _const from '../../const';

import './index.css';

class Profil extends Component {

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
  

    this.updateProfilePict(this.props.user.providerData[0].photoURL);

    this.userRef.on('value', userSnap => {
      let user = userSnap.val();

      if(user==null) {
        this.createUser();
      } else {
        
        this.setState({
          loading: true,
          user: user
        });
        this.loadFamillies();
      }
    });
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
    console.log('saveProfilePict', blob);
        var storageRef = firebase.storage().ref();
        var userProfilePictRef = storageRef.child('profilePict/' + this.uid + '.jpg')

        userProfilePictRef.put(blob).then((snapshot) => {
          this.userRef.update({pictUrl:snapshot.downloadURL});
        });
  }
  loadFamillies() {
    if(this.state.user && this.state.user.famillies && this.state.user.famillies[0]) {
      this.famillyRef = this.familliesRef.child(this.state.user.famillies[0]);
      this.famillyRef.on('value', famillySnap => {
        var _familly = famillySnap.val();
        if(!_familly.parents) {_familly.parents = [];}
        if(!_familly.childs) {_familly.childs = [];}
        this.setState({
          loading: false,
          famillies:[_familly]
        });
        this.loadFamilliesMembers();
      });
    } else {
      this.setState({
        loading: false,
        famillies:[]
      });
    }
  }
  loadFamilliesMembers() {
    console.log('loadFamilliesMembers', this.state.famillies[0]);
    // console.log('loadFamilliesMembers', [...this.state.famillies[0].parents, ...this.state.famillies[0].childs]);
    // [...this.state.famillies[0].parents, ...this.state.famillies[0].childs].map((userId)=>{

    // });
    for(var userId of Object.keys(this.state.famillies[0].parents)) {
        console.log('userId', userId);
        this.loadMember('parents', userId);
    }

  }
  loadMember(famillyType, userId) {
      console.log('loadMember', famillyType, userId);
      this.usersRef.child(userId).on('value', (userSnap)=> {
          console.log(userId, userSnap.val());
          var _famillies = this.state.famillies;
          _famillies[0][famillyType][userId] = userSnap.val();
          this.setState({
            famillies : _famillies
          });
      });
  }

  componentWillUnmount() {
    //
  }

  createUser() {
    let users = {};
    users[this.uid] = {
      fullName : this.props.user.displayName,
    }
    if(this.props.user.photoURL!=null) {
      users[this.uid].pictUrl = this.props.user.photoURL
    }
    this.usersRef.update(users);
  }
  setFamilyMemberType(familyMemberType) {
    this.userRef.update({familyMemberType:familyMemberType});
  }
  createFamilly() {

    let _familly = {label: "Famille de " + this.props.user.displayName};
     _familly[this.state.user.familyMemberType+'s'] = {};
     _familly[this.state.user.familyMemberType+'s'][this.uid] = false;

    this.familliesRef.push(_familly)
    .then((newFamilly)=>{
      console.log('familly', newFamilly.key);
      this.userRef.update({famillies:[newFamilly.key]});
    });
    
  }
  joinFamilly() {
    
  }

  render_familyState() {
     if(typeof(this.state.user.familyMemberType)==='undefined' || this.state.user.familyMemberType === null) {
      return (
        <div>
          <p>Es-tu un </p>
          <button onClick={this.setFamilyMemberType.bind(this, "parent")}>Parent</button>
          <button onClick={this.setFamilyMemberType.bind(this, "child")}>Enfant</button>
        </div>
      );
     }
     if(typeof(this.state.user.famillies)==='undefined' || this.state.user.famillies === null) {
      return (
        <div>
          <p>Les tâches dans l'app sont reliées à une famille.</p>
          <p>Si tu es le premier de ta famille à utiliser l'app, crée une famille, sinon join la famille créé par un autre membre de ta famille.</p>
          <p>Veux-tu </p>
          <button onClick={this.createFamilly.bind(this, "parent")}>Créer une famille</button>
          <Link to='/joinFamilly'>
            <button>Joindre une famille</button>
          </Link>
        </div>
      );
     }
  }

  render_userTile(userId, user) {
    return(
      <div key={userId} className="userTile">
        {
          (user.pictUrl!=null)
          ?<img className='profilPict' src={user.pictUrl} alt={user.fullName} />
          :<img className='profilPict' src="/img/default_profile.png" alt={user.fullName} />
        }
        <p className="name">
          {user.fullName}
        </p>
      </div>
    );
  }

  logoutUser() {
    firebase.auth().signOut();
  }

  render() {
    return (
      <div id="profil">
        <div className="header">
          <h1>Profil</h1>
        </div>
        <div className="content">
          {
            this.state.loading ? <div>Loading...</div>
              :
              <div>
                {this.render_familyState()}
                
                {
                  (this.state.user.pictUrl!=null)
                  ?<img className='profilPict' src={this.state.user.pictUrl} alt={this.props.user.displayName} />
                  :<img className='profilPict' src="/img/default_profile.png" alt={this.props.user.displayName} />
                }
                <h2>{this.props.user.displayName}</h2>
                
                {/* <p>{JSON.stringify(this.props.user.uid, null,4)}</p> */}
                
                <button id="logoutBtn" className='hide' onClick={this.logoutUser.bind(this)}>Me déconnecter</button>

                <hr />
                
                {Object.keys(this.state.famillies).map((famillyKey)=>{
                  let familly = this.state.famillies[famillyKey];
                  return(
                    <div key={famillyKey}>
                      <h2>{familly.label}</h2>
                      <h4>Parent(s)</h4>
                      <div className="usersTiles">
                        {Object.keys(familly.parents).map((userId)=>{
                          let user = familly.parents[userId];
                          return this.render_userTile(userId, user);
                        })}
                        <div className="userTile">
                          <Link to='/addFamillyMember'>
                            <img className='add' src="/img/plus.png" alt="Ajouter un parent à la famille" />
                          </Link>
                        </div>
                      </div>
                      <h4>Enfant(s)</h4>
                      <div className="usersTiles">
                        {Object.keys(familly.childs).map((userId)=>{
                          let user = familly.childs[userId];
                          return this.render_userTile(userId, user);
                        })}
                        <div className="userTile">
                          <Link to='/addFamillyMember'>
                            <img className='add' src="/img/plus.png" alt="Ajouter un enfant à la famille" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
          }
        </div>
      </div>
    );
  }
}

export default Profil;
