import React, { Component } from 'react';
import Block from '../../components/Block';
//import * as firebase from 'firebase';

import _const from '../../const';

import './index.css';

class Confirm extends Component {

  constructor(props) {
    super(props);

    this.uid = this.props.fbUser.uid;
    this.famillyId = this.props.user.famillies[0];

    //this.displayDateOptions = {weekday: "long", month: "long", day: "numeric"};
    //let _theDate = new Date();
    this.state = {
      childs:{},
      childsLists:{}
      //theDate : _theDate,
      //dateString : _theDate.getFullYear() + "" + ("00"+(_theDate.getMonth()+1)).slice(-2) + "" + ("00"+_theDate.getDate()).slice(-2)
    };


  }

  componentDidMount() {
    this.dbRef = _const.fbDb.ref();
    this.childsRef = this.dbRef.child('famillies').child(this.famillyId ).child('childs');
    this.usersRef = {};
    this.childsListsRef = {};
    this.childsListsArchivesRef = {};
    
    this.childsRef.on('value', childsSnap => {
      var famillies = childsSnap.val();
      for(var userKey of Object.keys(famillies)) {

        this.usersRef[userKey] = this.dbRef.child('users').child(userKey);
        this.childsListsRef[userKey] = this.dbRef.child('lists').child(userKey);


        this.usersRef[userKey].on('value', userSnap => {
          var _childs = this.state.childs;
          _childs[userSnap.key] = userSnap.val();
          this.setState({
            childs:_childs
          });
        });

        this.childsListsRef[userKey].on('value', childsListsSnap => {
          var _childsLists = this.state.childsLists;
          _childsLists[childsListsSnap.key] = childsListsSnap.val();
          this.setState({
            childsLists:_childsLists
          });
        });
      }
    });
  }
  componentWillUnmount() {
    //TODO unmount
  }

  confirmDay(childKey, confirmDateKey) {
    let _data = {};
    _data[confirmDateKey] = this.state.childsLists[childKey][confirmDateKey];
    console.log('_data', _data);

    this.childsListsArchivesRef[childKey] = this.dbRef.child('lists_archives').child(childKey);
    this.childsListsArchivesRef[childKey].update(_data, (err)=>{
      console.log('done copy data to archives');
      if(!err) {
        _data[confirmDateKey] = null;
        this.childsListsRef[childKey].update(_data, (err2)=>{
          console.log('done removing day list');
        });
      }
    });
  }

  render() {
    return (
      <div id="confirm">
        <div className="header">
          <h1>Confirmation</h1>
        </div>
        <div className="content">
          {/* <h2>{this.state.theDate.toLocaleDateString('fr-CA', this.displayDateOptions)}</h2> */}

          {Object.keys(this.state.childs).map(childKey => {
            let child = this.state.childs[childKey];
            return(
              <div key={childKey}>
                <h2>{child.fullName}</h2>
                {/* <p>{child.pictUrl}</p> */}
                
                {(!this.state.childsLists[childKey]) ? 
                <div className="confirmDone">Toutes les listes sont confirmées</div>
                :  
                  Object.keys(this.state.childsLists[childKey]).map(dateKey => {
                    var theDate = new Date(this.state.childsLists[childKey][dateKey].str_date);
                    var data = this.state.childsLists[childKey][dateKey].data;

                    let doneCount = Object.keys(data.blocks).reduce((total, blockKey)=> {
                      var taskCount = Object.keys(data.blocks[blockKey].tasks).filter((taskKey, index)=>{
                        return data.blocks[blockKey].tasks[taskKey].state === 'done';
                      }).length;
                      return total + taskCount;
                    }, 0);
            
                    let taskCount = Object.keys(data.blocks).reduce((total, blockKey)=> {
                      var taskCount = Object.keys(data.blocks[blockKey].tasks).length;
                      return total + taskCount;
                    }, 0);

                    let pts = doneCount * 5;
                    if(doneCount === taskCount) {
                      pts += 10;
                    }

                    return(
                      <div key={dateKey}>
                        <h3>{theDate.toLocaleDateString('fr-CA', this.displayDateOptions)}</h3>
                        {(data.blocks && 
                          Object.keys(data.blocks).map(blockKey => {
                            var block = data.blocks[blockKey];

                            return (<Block key={blockKey} uid={childKey} dateString={dateKey} blockKey={blockKey} block={block} />);
                          })
                        )}
                        <div className="daySummary">
                          <h3>{theDate.toLocaleDateString('fr-CA', this.displayDateOptions)} [{doneCount}/{taskCount}] >> {pts} pts </h3>
                          <button onClick={this.confirmDay.bind(this, childKey, dateKey)}>Confirm</button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            );
          })

          }
        </div>
      </div>
    );
  }
}

export default Confirm;
