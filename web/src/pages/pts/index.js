import React, { Component } from 'react';
import PtsTile from '../../components/pts';
 import _const from '../../const';

import './index.css';

class Pts extends Component {

  constructor(props) {
    super(props);

    this.uid = this.props.fbUser.uid;
    this.famillyId = this.props.user.famillies[0];
    
    this.theDate = new Date();
    this.year = this.theDate.getFullYear();
    this.month = this.theDate.getMonth() + 1;
    this.date = this.theDate.getDate();

    this.state = {
      childs:[]
    };


  }

  componentDidMount() {
    if(this.props.user.familyMemberType === "parent") {
      
      this.dbRef = _const.fbDb.ref();
      this.childsRef = this.dbRef.child('famillies').child(this.famillyId ).child('childs');
      this.usersRef = {};
      this.ptsRef = {};

      this.childsRef.on('value', childsSnap => {
        var famillies = childsSnap.val();

        for(var userKey of Object.keys(famillies)) {

          this.usersRef[userKey] = this.dbRef.child('users').child(userKey);
          this.ptsRef[userKey] = this.dbRef.child('pts').child(userKey);
  
  
          this.usersRef[userKey].on('value', userSnap => {
            var _childs = this.state.childs;
            _childs[userSnap.key] = _childs[userSnap.key] || {};
            _childs[userSnap.key].user = userSnap.val();
            this.setState({
              childs:_childs
            });
          });

          this.ptsRef[userKey].on('value', userSnap => {
            var _childs = this.state.childs;
            _childs[userSnap.key] = _childs[userSnap.key] || {};
            let _pts = userSnap.val();
            _pts[this.year] = _pts[this.year] || {};
            _pts[this.year][this.month] = _pts[this.year][this.month] || {};
            _pts[this.year][this.month][this.date] = _pts[this.year][this.month][this.date] || {};
            _pts[this.year][this.month][this.date].remove = _pts[this.year][this.month][this.date].remove || 0;
            _childs[userSnap.key].pts = _pts;

            this.setState({
              childs:_childs
            });
          });

        }
      });
    }

  }

  componentWillUnmount() {
  }

  ptsChange(userKey, event) {
    var _pts = event.target.value;
    var _childs = this.state.childs;
    _childs[userKey].pts[this.year][this.month][this.date].remove = _pts;
    this.setState({
      childs:_childs
    });
  }
  ptsAdd(userKey) {
    var _childs = this.state.childs;
    var _pts = _childs[userKey].pts[this.year][this.month][this.date].remove + 5;
    this.ptsRef[userKey].child(this.year).child(this.month).child(this.date).update({remove:_pts});
  }
  ptsRemove(userKey) {
    var _childs = this.state.childs;
    var _pts = _childs[userKey].pts[this.year][this.month][this.date].remove - 5;
    this.ptsRef[userKey].child(this.year).child(this.month).child(this.date).update({remove:_pts});
  }
  savePts(userKey, event) {
    var _pts = event.target.value*1;
    this.ptsRef[userKey].child(this.year).child(this.month).child(this.date).update({remove:_pts});
  }

  render() {
    return (
      <div id="pts">
        <div className="header">
          <h1>Points</h1>
        </div>
        <div className="content">
          {(this.props.user.familyMemberType === 'child') ? 
            <div className="childBlock">
              <PtsTile uid={this.uid} />
            </div>
            :
            <div>
              {Object.keys(this.state.childs).map(childKey => {
                let child = this.state.childs[childKey];
                
                if(child.pts==null) { return(<div key={childKey}>Chargement...</div>); }

                return(
                  <div key={childKey} className="childBlock">
                    <h2>{child.user.fullName}</h2>

                    <div className="userRow">
                      <div className="leftPts">
                        <PtsTile uid={childKey} skipToday={true} />
                      </div>
                      <div className="rightPts">
                        <PtsTile uid={childKey} />
                      </div>
                      <div className="middle">
                        <h3>La date</h3>
                        <input type="tel" value={child.pts[this.year][this.month][this.date].remove} onChange={this.ptsChange.bind(this, childKey )} onBlur={this.savePts.bind(this, childKey )} />
                        <button onClick={this.ptsRemove.bind(this, childKey)}>-</button>
                        <button onClick={this.ptsAdd.bind(this, childKey)}>+</button>
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

export default Pts;
