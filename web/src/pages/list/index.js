import React, { Component } from 'react';
//import Task from '../../components/Task';
import Block from '../../components/Block';
//import * as firebase from 'firebase';

import _const from '../../const';

import './index.css';

class List extends Component {

  constructor(props) {
    super(props);

    this.uid = this.props.fbUser.uid;
    this.famillyId = this.props.user.famillies[0];

    this.displayDateOptions = {weekday: "long", month: "long", day: "numeric"};
    //let _theDate = new Date(2017,10,1);
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
        lists: snap.val(),
        dayIsClose:false
      });

      if(this.state.lists==null) {

        _const.fbDb.ref().child('lists_archives').child(this.uid).child(this.state.dateString).once('value', snapListArchives => {
          console.log('snapListArchives', snapListArchives.val());
          if(!snapListArchives.val()) {
            this.createTheDayLists();
          } else {
            this.setState({
              dayIsClose:true
            });
          }
        })

        
      } 
    });

  }

  createTheDayLists() {

    let templateRef = _const.fbDb.ref().child('templates/'+this.famillyId);
    templateRef.once('value').then(templateSnap => {
      let _templateData = templateSnap.val();
      if(_templateData!= null) {
        let firstKey = Object.keys(_templateData)[0];
        let firstDayType = _templateData[firstKey];

        let dayList = {};
        dayList[this.state.dateString] = {
          str_date:this.state.theDate,
          data:Object.assign({}, firstDayType)
        };
        this.listsRef.update(dayList);
      }
    });
    
  }

  componentWillUnmount() {
    this.listsRef.off();
    this.toDayListRef.off();
  }


  render() {
    let dayDone = false;
    if(this.state.lists!=null && this.state.lists.data!=null &&
      Object.keys(this.state.lists.data.blocks).filter((blockKey) => {
        let block = this.state.lists.data.blocks[blockKey];

        let doneCount = Object.keys(block.tasks).filter(tKey=>{
          return block.tasks[tKey].state === 'done';
        }).length;
        let taskCount = Object.keys(block.tasks).length;
        return doneCount!==taskCount;
      }).length === 0
    ) {
      dayDone = true;
    }

    return (
      <div id="list">
        <div className="header">
          <h1>Listes</h1>
        </div>
        <div className="content">
          <h2>{this.state.theDate.toLocaleDateString('fr-CA', this.displayDateOptions)}</h2>
          {
            
            this.state.dayIsClose ? this.renderDayClose() :
            
            dayDone ? this.renderDayDone() :

            <div className="dayList">

              {(this.state.lists != null) && (this.state.lists.data != null) && (this.state.lists.data.blocks != null) &&
                Object.keys(this.state.lists.data.blocks).map((blockKey, index) => {
                  let block = this.state.lists.data.blocks[blockKey];

                  return (<Block key={blockKey} ui="child" uid={this.uid} dateString={this.state.dateString} blockKey={blockKey} block={block} />);
                })
              }

            </div>
          }
        </div>
      </div>
    );
  }
  renderDayClose() {
    return (
    <div>
      <div style={{width:'100%', height:'200px', position:'relative'}}>
        <div style={{width:'100%',height:0,paddingBottom:'143%',position:'relative'}}><iframe src="https://giphy.com/embed/xmW8F2ksN0KA0" width="100%" height="100%" style={{position:'absolute'}} frameBorder="0" class="giphy-embed" title="Journée confirmée" allowFullScreen></iframe></div>
        <div style={{position:'absolute',width:'90%', height:'100%', top:'50%', left:'5%', textAlign:'center', color:'#FFF', fontSize:'24px', textShadow: '1px 1px 2px black',zindez:99}}>Ta journée a été confirmé par un parent. Reviens demain.</div>
      </div>
    </div>);
  }
  renderDayDone() {
    return (
    <div>
      <div style={{width:'100%', height:'200px', position:'relative'}}>
        <div style={{width:'100%',height:0,paddingBottom:'143%',position:'relative'}}><iframe src="https://giphy.com/embed/l1J3pT7PfLgSRMnFC" width="100%" height="100%" style={{position:'absolute'}} frameBorder="0" class="giphy-embed" title="Journée complétée" allowFullScreen></iframe></div>
        <div style={{position:'absolute',width:'90%', height:'100%', top:'50%', left:'5%', textAlign:'center', color:'#FFF', fontSize:'24px', textShadow: '1px 1px 2px black',zindez:99}}>Journée complétée</div>
      </div>
    </div>);
  }
}

export default List;
