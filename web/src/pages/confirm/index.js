import React, { Component } from 'react';
import Task from '../../components/Task';
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

  render() {
    return (
      <div id="list">
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
                <p>{child.pictUrl}</p>
                
                {(this.state.childsLists[childKey] && 
                  Object.keys(this.state.childsLists[childKey]).map(dateKey => {
                    var data = this.state.childsLists[childKey][dateKey].data;

                    return(
                      <div key={dateKey}>
                        <h3>{dateKey}</h3>
                        {(data.blocks && 
                          Object.keys(data.blocks).map(blockKey => {
                            var block = data.blocks[blockKey];

                            return(
                              <div key={blockKey}>
                                <h4>{block.label}</h4>
                                {(block.tasks && 
                                  Object.keys(block.tasks).map(taskKey => {
                                    var task = block.tasks[taskKey];

                                    return(
                                      <Task key={taskKey} uid={childKey} dateString={dateKey} blockKey={blockKey} taskKey={taskKey} task={task} />
                                    )
                                  })
                                )}
                              </div>
                            )
                          })
                        )}
                      </div>
                    );
                  })
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
