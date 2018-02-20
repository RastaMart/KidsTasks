import React, { Component } from 'react';
import Block from '../../components/Block';
import ContextualisedDate from '../../components/ContextualisedDate';
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
      showArchives:false,
      childs:{},
      childsLists:{},
      childsListsArchives:{}
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
    this.childsPstRef = {};
    
    this.childsRef.on('value', childsSnap => {
      var famillies = childsSnap.val();
      for(var userKey of Object.keys(famillies)) {

        this.usersRef[userKey] = this.dbRef.child('users').child(userKey);
        this.childsListsRef[userKey] = this.dbRef.child('lists').child(userKey);
        this.childsListsArchivesRef[userKey] = this.dbRef.child('lists_archives').child(userKey);



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

  loadArchives(userKey) {
    if(this.state.showArchives && this.state.childsListsArchives[userKey] === undefined) {
      
      //this.childsListsArchivesRef[userKey].limitToLast(10).on('value', childsListsSnap => {
      this.childsListsArchivesRef[userKey].on('value', childsListsSnap => {
        var _childsListsArchives = this.state.childsListsArchives;
        _childsListsArchives[childsListsSnap.key] = childsListsSnap.val();
        this.setState({
          childsListsArchives:_childsListsArchives
        });
      });
    }
  }

  toogleArchivesDay(userKey) {
    this.setState({
      showArchives : !this.state.showArchives
    }, () => {
      this.loadArchives(userKey);
    })
  }

  confirmDay(childKey, confirmDateKey, pts) {
    let _data = {};
    _data[confirmDateKey] = this.state.childsLists[childKey][confirmDateKey];

    let dateArray = this.dateKeyToDateArray(confirmDateKey);
    let simpleDate = {
      year:dateArray[0],
      month:dateArray[1],
      day:dateArray[2]
    }
    let _path = "pts/" + childKey + "/" + simpleDate.year + "/" + simpleDate.month + "/" + simpleDate.day;

    this.childsPstRef[childKey] = _const.fbDb.ref(_path);

    this.childsListsArchivesRef[childKey].update(_data, (err)=>{
      if(!err) {

        this.childsPstRef[childKey].update({add:pts}, (err2) => {
        });

        _data[confirmDateKey] = null;
        this.childsListsRef[childKey].update(_data, (err2)=>{
        });
      }
    });
  }
  unConfirmDay(childKey, confirmDateKey) {
    let _data = {};
    _data[confirmDateKey] = this.state.childsListsArchives[childKey][confirmDateKey];
    console.log('unConfirmDay _data', JSON.stringify(_data[confirmDateKey]));

    let dateArray = this.dateKeyToDateArray(confirmDateKey);
    let simpleDate = {
      year:dateArray[0],
      month:dateArray[1],
      day:dateArray[2]
    }
    console.log('simpleDate', simpleDate);
    let _path = "pts/" + childKey + "/" + simpleDate.year + "/" + simpleDate.month + "/" + simpleDate.day;
    console.log('_path', _path);

    this.childsPstRef[childKey] = _const.fbDb.ref(_path);
        
    Object.keys(_data[confirmDateKey].data.blocks).forEach(blockKey => {
      var block = _data[confirmDateKey].data.blocks[blockKey];
      Object.keys(block.tasks).forEach(taskKey => {
        var task = block.tasks[taskKey];
        if(task.pts === undefined) {
          task.pts = 5;
        }
      });
    });

    this.childsListsRef[childKey].update(_data, (err)=>{
      console.log('done copy data to active');
      if(!err) {

        this.childsPstRef[childKey].update({add:0}, (err2) => {
          console.log('done removing pts');
        });

        _data[confirmDateKey] = null;
        this.childsListsArchivesRef[childKey].update(_data, (err2)=>{
          console.log('done removing archives day list');
        });
      }
    });
  }

  dateKeyToDatePath(dateKey) {
    if(dateKey.length !== 8) {
      throw new Error("dateKey need to be in yyyymmdd format : " + dateKey);
    }
    return dateKey.slice(0,4) + "/" + dateKey.slice(4,6) + "/" + dateKey.slice(6,8);
  }
  dateKeyToDateArray(dateKey) {
    if(dateKey.length !== 8) {
      throw new Error("dateKey need to be in yyyymmdd format : " + dateKey);
    }
    return this.dateKeyToDatePath(dateKey).split('/');
  }
  setToDrillObject(obj, arr, value) {
    let _obj = Object.assign({}, obj);
    if(arr.length === 1) {
      _obj[arr[0]] = value;
    } else {
      _obj[arr[0]] = this.setToDrillObject(_obj, arr.slice(1), value);
    }
    return _obj;
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
                  Object.keys(this.state.childsLists[childKey]).reverse().map(dateKey => {
                    var theDate = new Date(this.state.childsLists[childKey][dateKey].str_date);
                    var data = this.state.childsLists[childKey][dateKey].data;

                    let pts = Object.keys(data.blocks).reduce((total, blockKey)=> {
                      let blockPts = Object.keys(data.blocks[blockKey].tasks).reduce((blockTotal, taskKey, index)=>{
                        if( data.blocks[blockKey].tasks[taskKey].state === 'done' ) {
                          let taskPts = data.blocks[blockKey].tasks[taskKey].pts || 0;
                           return blockTotal + taskPts;
                         } else {
                            return blockTotal;
                         }
                      }, 0);

                      return total + blockPts;
                    }, 0);

                    return(
                      <div key={dateKey} className="childContent">
                        <div className="dayContent">
                          <h3 onClick={this.confirmDay.bind(this, childKey, dateKey, pts)}>
                            <i className="fa fa-square-o"></i> 
                            <ContextualisedDate date={theDate} />
                            <span className="rightZone">
                              {pts} pts 
                            </span>
                          </h3>
                          {(data.blocks && 
                            Object.keys(data.blocks).map(blockKey => {
                              var block = data.blocks[blockKey];

                              return (<Block key={blockKey} ui="parent" uid={childKey} dateString={dateKey} blockKey={blockKey} block={block} />);
                            })
                          )}
                        </div>
                      </div>
                    );
                  }
                )}

                <div className="childContent">
                  <h3 onClick={this.toogleArchivesDay.bind(this, childKey)}>
                    {(!this.state.showArchives) ? 
                      <i className="fa fa-caret-right"></i>
                    :
                      <i className="fa fa-sort-down"></i> 
                    }
                    <span>Journées archivées</span>
                  </h3>
                </div>

                {
                  (!this.state.showArchives) ? 
                    <div className="childContent"></div>
                  :
                  (!this.state.childsListsArchives[childKey]) ? 
                    <div className="childContent">Chargement</div>
                  : Object.keys(this.state.childsListsArchives[childKey]).reverse().map(dateKey => {
                    var theDate = new Date(this.state.childsListsArchives[childKey][dateKey].str_date);
                    var data = this.state.childsListsArchives[childKey][dateKey].data;

                    let pts = Object.keys(data.blocks).reduce((total, blockKey)=> {
                      let blockPts = Object.keys(data.blocks[blockKey].tasks).reduce((blockTotal, taskKey, index)=>{
                        if( data.blocks[blockKey].tasks[taskKey].state === 'done' ) {
                          let taskPts = data.blocks[blockKey].tasks[taskKey].pts || 0;
                           return blockTotal + taskPts;
                         } else {
                            return blockTotal;
                         }
                      }, 0);

                      return total + blockPts;
                    }, 0);

                    return(
                      <div key={dateKey} className="childContent confirmed">
                        <div className="dayContent">
                          <h3 onClick={this.unConfirmDay.bind(this, childKey, dateKey, pts)}>
                            <i className="fa fa-check-square-o"></i> 
                            <ContextualisedDate date={theDate} />
                            <span className="rightZone">
                              {pts} pts 
                            </span>
                          </h3>
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
