import React, { Component } from 'react';
import Task from '../Task';
//import { Link } from 'react-router-dom';

import _const from '../../const';

import './index.css';

class Block extends Component {

    constructor(props) {
        super(props);

        this.state = {
        }
        
    }
    componentDidMount() {

        this.blocksRef = _const.fbDb.ref()
            .child('lists')
            .child(this.props.uid)
            .child(this.props.dateString)
            .child('data')
            .child('blocks');

        this.updateBlock(this.props.block);
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.block !== nextProps.block) {
            this.updateBlock(nextProps.block);
        }
    }
    updateBlock(block) {
        
        this.setState({
            block:block
        });
    }
    forceOpenBlock(wantItOpen) {
        let newBlock = Object.assign({}, this.state.block);
        newBlock.forceOpen = wantItOpen;
        var updates = {};
        updates[this.props.blockKey] = newBlock;
        this.blocksRef.update(updates);
    }
    
    render() {
        if(!this.state.block) {
            return (<div></div>);
        }

        let doneCount = Object.keys(this.state.block.tasks).filter(tKey=>{
            return this.state.block.tasks[tKey].state === 'done';
        }).length;

        let taskCount = Object.keys(this.state.block.tasks).length;
     
        let blockPts = Object.keys(this.state.block.tasks).reduce((blockTotal, taskKey, index)=>{
            if( this.state.block.tasks[taskKey].state === 'done' ) {
                let taskPts = this.state.block.tasks[taskKey].pts || 0;
                return blockTotal + taskPts;
            } else {
                return blockTotal;
            }
        }, 0);

        let forceCloseDOM = (this.props.ui === 'child' && this.state.block.forceOpen) ? <li><button onClick={this.forceOpenBlock.bind(this, false)}>Cacher</button></li> : "";

        let tasksListDOM = (this.props.ui === 'child' && doneCount===taskCount && !this.state.block.forceOpen) ? 
            <div>
                <button onClick={this.forceOpenBlock.bind(this, true)}>Revoir</button>
            </div> 
        : 
            <ul>
                {(this.state.block.tasks != null) && 
                    Object.keys(this.state.block.tasks).map((taskKey, index) => {
                    let task = this.state.block.tasks[taskKey];

                    return(
                        <Task key={taskKey} uid={this.props.uid} dateString={this.props.dateString} blockKey={this.props.blockKey} taskKey={taskKey} task={task} />
                    );
                })}
                {forceCloseDOM}
            </ul>
        ;

        return (
            <div key={this.props.blockKey} data-blockkey={this.props.blockKey} className={'block' + (doneCount===taskCount?' completed':'')}>
                <h3>
                    {this.state.block.label} {" "}
                    {/* [{doneCount}/{taskCount}] {" "} */}
                    <i className="fa fa-check-circle"></i>
                    <span className="rightZone">
                        {blockPts} pts
                    </span>
                </h3>
                {tasksListDOM}
            </div>
        );
    }
}

export default Block;