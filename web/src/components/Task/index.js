import React, { Component } from 'react';
//import { Link } from 'react-router-dom';

import _const from '../../const';

import './index.css';

class Task extends Component {

    constructor(props) {
        super(props);


        this.state = {
            blockKey:this.props.blockKey,
            taskKey:this.props.taskKey,
            task:this.props.task,
            classState:"",
            classIcon:""
        }
        
        this.tasksRef = _const.fbDb.ref()
                                    .child('lists')
                                    .child(this.props.uid)
                                    .child(this.props.dateString)
                                    .child('data')
                                    .child('blocks')
                                    .child(this.props.blockKey)
                                    .child('tasks');
    }
    componentDidMount() {
        this.updateTask(this.props.task);
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.task !== nextProps.task) {
            this.updateTask(nextProps.task);
        }
    }
    updateTask(task) {
        let _classState = "task";
        let _classIcon = "fa fa-square-o";
        if(task.state === 'done') {
          _classState += ' done';
          _classIcon = "fa fa-check-square-o";
        }
        this.setState({
            task:task,
            classState:_classState,
            classIcon:_classIcon
        });
    }
    
    toggleTask() {
      
        let task = this.state.task;
        let newTask = Object.assign({}, task);
        if(typeof(task.state)==='undefined' || task.state === 'todo') {
            newTask.state = 'done';
        } else {
            newTask.state = 'todo';
        }
        var updates = {};
        updates[this.props.taskKey] = newTask;
        this.tasksRef.update(updates,(err)=>{

        });
    }

    render() {
        return (
            <li className={this.state.classState} onClick={this.toggleTask.bind(this)}>
                <i className={this.state.classIcon}></i> <span>{this.state.task.label}</span>
            </li>
            //  <li className="after"><i className="fa fa-star-o"></i> <span>Ballon</span></li>
                        
        )
    }
}

export default Task;