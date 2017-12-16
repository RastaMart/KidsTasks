import React, { Component } from 'react';

import _const from '../../const';

import './index.css';

class Pts extends Component {

  constructor(props) {
    super(props);

    this.uid = this.props.fbUser.uid;
    this.famillyId = this.props.user.famillies[0];

    this.displayDateOptions = {weekday: "long", month: "long", day: "numeric"};
    //let _theDate = new Date(2017,10,1);
    let _theDate = new Date();
    this.state = {
      theDate : _theDate,
      dateString : _theDate.getFullYear() + "" + ("00"+(_theDate.getMonth()+1)).slice(-2) + "" + ("00"+_theDate.getDate()).slice(-2),
      ptsDetails:[],
      ptsTotal:0
    };


  }

  componentDidMount() {

    this.ptsRef = _const.fbDb.ref().child('pts').child(this.uid);

    this.ptsRef.on('value', snapPts => {
      console.log('snapPts', snapPts.val());
      this.setState({ptsDetails : snapPts.val()}, ()=> {
        this.countPts();
      });
      
    });

  }
  countPts() {
    let _total = Object.keys(this.state.ptsDetails).reduce((total, dayKey) => {
      let _day = this.state.ptsDetails[dayKey];
      return total+_day;
    }, 0);
    console.log('_total', _total);
    this.setState({ptsTotal:_total});
  }

  componentWillUnmount() {
  }


  render() {
    return (
      <div id="pts">
        <div className="header">
          <h1>Points</h1>
        </div>
        <div className="content">
          <div className="ptsTotal">{this.state.ptsTotal}</div>
        </div>
      </div>
    );
  }
}

export default Pts;
