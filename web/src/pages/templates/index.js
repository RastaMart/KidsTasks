import React, { Component } from 'react';
//import * as firebase from 'firebase';

import _const from '../../const';

import './index.css';

class Templates extends Component {

  constructor(props) {
    super(props);

    this.uid = this.props.fbUser.uid;
    this.famillyId = this.props.user.famillies[0];
    console.log('this.famillyId', this.famillyId);
    this.state = {
      templates: {},
    };


  }

  componentDidMount() {

    this.templatesRef = _const.fbDb.ref().child('templates').child(this.famillyId);

    this.templatesRef.on('value', snap => {
      console.log('snap',snap.val());
      this.setState({
        loading: false,
        templates: snap.val()
      });


      let addBlockLabels = document.getElementsByClassName('addBlockLabel');
      for(let addBlockLabel of addBlockLabels) {
        addBlockLabel.onchange = () => {
          if(addBlockLabel.value !== "") {
            this.addBlock(addBlockLabel);
          }
        }
      }

      let addTaskLabels = document.getElementsByClassName('addTaskLabel');
      for(let addTaskLabel of addTaskLabels) {
        addTaskLabel.onchange = () => {
          if(addTaskLabel.value !== "") {
            this.addTask(addTaskLabel);
          }
        }
      }
    });

    let addDayTypeLabel = document.getElementById('addDayTypeLabel');
    addDayTypeLabel.onchange = () => {
      if(addDayTypeLabel.value !== "") {
        this.addDayType(addDayTypeLabel);
      }
    }
  }
  addDayType(el) {
    console.log('addDayType', el.value)
    if (el.value !== "") {
      this.templatesRef.push({
        //persisted: true,
        label: el.value
      });
      el.value = '';
    }
  }
  addBlock(el) {
    if (el.value !== "") {
      let dayTypeKey = el.getAttribute('data-daytypekey');
      this.templatesRef.child(dayTypeKey).child('blocks').push({
        //persisted: true,
        label: el.value
      });
      el.value = '';
    }
  }
  deleteBlock(dayTypeKey, blockKey) {
    console.log('deleteBlock', dayTypeKey, blockKey);
    let block = this.state.templates[dayTypeKey].blocks[blockKey];
    console.log('block', block);
     if (window.confirm(`Voulez-vous vraiment suprimer le bloc ${block.label}?`)) {
       console.log('Go efface ' + blockKey);
       var updates = {};
       updates[blockKey] = null;
       this.templatesRef.child(dayTypeKey).child('blocks').update(updates);
     }
  }
  deleteTask(dayTypeKey, blockKey, taskKey) {
    console.log('deleteTask', dayTypeKey, blockKey, taskKey);

    let task = this.state.templates[dayTypeKey].blocks[blockKey].tasks[taskKey];
    console.log('task', task);

    if (window.confirm(`Voulez-vous vraiment suprimer la tâche  ${task.label}?`)) {
       console.log('Go efface ' + taskKey);
       var updates = {};
       updates[taskKey] = null;
       this.templatesRef.child(dayTypeKey).child('blocks').child(blockKey).child('tasks').update(updates);
    }
  }
  addTask(el) {
    console.log(this, el);
    if (el.value !== "") {
      console.log('Save this Task');
      let dayTypeKey = el.getAttribute('data-daytypekey');
      let blockKey = el.getAttribute('data-blockkey');

      this.templatesRef.child(dayTypeKey).child('blocks').child(blockKey).child('tasks').push({
        label:el.value
      });
      el.value = '';
    }
  }


  componentWillUnmount() {
    this.templatesRef.off();
  }

  render() {
    return (
      <div id="templates">
        <div className="header">
          <h1>Modèles</h1>
        </div>
        <div className="content">
          {(this.state.templates != null) &&
            Object.keys(this.state.templates).map((dayTypeKey, index) => {
              let dayType = this.state.templates[dayTypeKey];

              return (
                <div className="dayType" key={dayTypeKey}>
                  <h2>{dayType.label}</h2>
                  <div className="dayList">
                    {(dayType.blocks != null) &&
                      Object.keys(dayType.blocks).map((blockKey, index) => {
                        let block = dayType.blocks[blockKey];

                        return (
                          <div key={blockKey} data-blockkey={blockKey} className="block">
                            <h3><i className="fa fa-minus-circle" onClick={this.deleteBlock.bind(this, dayTypeKey, blockKey)}></i> {block.label}</h3>
                            <ul>
                              {(block.tasks!=null) &&
                                Object.keys(block.tasks).map((taskKey, index) => {
                                  let task = block.tasks[taskKey];
                                  
                                  return (
                                    <li key={taskKey}>
                                      <i className="fa fa-minus-square-o" onClick={this.deleteTask.bind(this, dayTypeKey, blockKey, taskKey)}></i> 
                                      <span>{task.label}</span>
                                      <i className="fa fa-bars"></i> 
                                    </li>
                                  )
                                })
                              }
                              

                              <li className="done">
                                <i className="fa fa-plus"></i> 
                                <input type="text" placeholder="ajouter une tâche" className="addTaskLabel" data-daytypekey={dayTypeKey} data-blockkey={blockKey} />
                              </li>
                            </ul>
                          </div>
                        )
                      })
                    }
                    <div className="addBlock">
                      <h3>
                        <i className="fa fa-plus"></i> 
                        <input type="text" placeholder="ajouter un bloc" className="addBlockLabel" data-daytypekey={dayTypeKey} /></h3>
                    </div>
                  </div>
                </div>
              )
            })
          }
          <div id="addDayType">
            <h3>
              <i className="fa fa-plus"></i> 
              <input type="text" placeholder="ajouter un type de journée" id="addDayTypeLabel" /></h3>
          </div>
        </div>
      </div>
    );
  }
}

export default Templates;
