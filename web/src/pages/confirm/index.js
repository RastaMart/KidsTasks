import React, { Component } from 'react';
//import * as firebase from 'firebase';

import _const from '../../const';

import './index.css';

class Confirm extends Component {

  constructor(props) {
    super(props);

    this.uid = this.props.fbUser.uid;
    this.famillyId = this.props.user.famillies[0];

    this.displayDateOptions = {weekday: "long", month: "long", day: "numeric"};
    let _theDate = new Date();
    this.state = {
      theDate : _theDate,
      dateString : _theDate.getFullYear() + "" + ("00"+(_theDate.getMonth()+1)).slice(-2) + "" + ("00"+_theDate.getDate()).slice(-2)
    };


  }

  componentDidMount() {

    this.listsRef = _const.fbDb.ref().child('lists').child(this.uid);
    this.toDayListRef = this.listsRef.child(this.state.dateString);

    this.toDayListRef.on('value', snap => {

      this.setState({
        loading: false,
        //lists: snap.val()
      });

    });

  }
  componentWillUnmount() {
    this.listsRef.off();
    this.toDayListRef.off();
  }

  toggleTask(blockKey, taskKey) {

    let task = this.state.lists.data.blocks[blockKey].tasks[taskKey];
    let newTask = Object.assign({}, task);
    if(typeof(task.state)==='undefined' || task.state === 'todo') {
      newTask.state = 'done';
    } else {
      newTask.state = 'todo';
    }

    var updates = {};
    updates[taskKey] = newTask;
    this.toDayListRef.child('data').child('blocks').child(blockKey).child('tasks').update(updates);
  }
  forceOpenBlock(blockKey, wantItOpen) {
    let block = this.state.lists.data.blocks[blockKey];
    let newBlock = Object.assign({}, block);
    newBlock.forceOpen = wantItOpen;
    var updates = {};
    updates[blockKey] = newBlock;
    this.toDayListRef.child('data').child('blocks').update(updates);
  }

  render() {
    return (
      <div id="list">
        <div className="header">
          <h1>Confirmation</h1>
        </div>
        <div className="content">
          <h2>{this.state.theDate.toLocaleDateString('fr-CA', this.displayDateOptions)}</h2>

          <div className="dayList">

            {(this.state.lists != null) && (this.state.lists.data != null) && (this.state.lists.data.blocks != null) &&
              Object.keys(this.state.lists.data.blocks).map((blockKey, index) => {
                let block = this.state.lists.data.blocks[blockKey];

                let doneCount = Object.keys(block.tasks).filter(tKey=>{
                  return block.tasks[tKey].state === 'done';
                }).length;
                let taskCount = Object.keys(block.tasks).length;
                
                let forceCloseDOM = (block.forceOpen) ? <li><button onClick={this.forceOpenBlock.bind(this, blockKey, false)}>... Cacher ce block</button></li> : "";

                let tasksListDOM = (doneCount===taskCount && !block.forceOpen) ? 
                  <div>
                    <button onClick={this.forceOpenBlock.bind(this, blockKey, true)}>...</button>
                  </div> : 
                  <ul>
                  {(block.tasks != null) && 
                    Object.keys(block.tasks).map((taskKey, index) => {
                      let task = block.tasks[taskKey];

                      let classState = "";
                      let classIcon = "fa fa-square-o";
                      if(task.state === 'done') {
                        classState = 'done';
                        classIcon = "fa fa-check-square-o";
                      }

                      return(
                        <li key={taskKey} className={classState} onClick={this.toggleTask.bind(this, blockKey, taskKey)}>
                          <i className={classIcon}></i> <span>{task.label}</span>
                        </li>
                        //  <li className="after"><i className="fa fa-star-o"></i> <span>Ballon</span></li>
                      );
                  })}
                  {forceCloseDOM}
                </ul>
                ;

                return (
                  <div key={blockKey} data-blockkey={blockKey} className="block">
                    <h3>{block.label} [{doneCount}/{taskCount}] </h3>
                    {tasksListDOM}
                  </div>
                );
              })
            }

          </div>
          
        </div>
      </div>
    );
  }
}

export default Confirm;
