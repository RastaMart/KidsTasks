import React, { Component } from 'react';
//import * as firebase from 'firebase';

//import _const from '../../const';

import './index.css';

class Profil extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

  }

  componentDidMount() {
    this.setState({
      loading: false
    });
  }

  componentWillUnmount() {

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
                !!!
                <img className='profilPict' src={this.props.user.photoURL} alt={this.props.user.displayName} />
                <h2>{this.props.user.displayName}</h2>
                {/* <p>{JSON.stringify(this.props.user.uid, null,4)}</p> */}
                <button id="logoutBtn" className='hide'>Me déconnecter</button>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default Profil;
