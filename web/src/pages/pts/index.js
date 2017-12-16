import React, { Component } from 'react';

import _const from '../../const';

import './index.css';

class Pts extends Component {

  constructor(props) {
    super(props);

    this.uid = this.props.fbUser.uid;
    this.famillyId = this.props.user.famillies[0];

    //this.displayDateOptions = {weekday: "long", month: "long", day: "numeric"};
    //let _theDate = new Date(2017,10,1);
    let _theDate = new Date();
    this.state = {
      theDate : _theDate,
      //dateString : _theDate.getFullYear() + "" + ("00"+(_theDate.getMonth()+1)).slice(-2) + "" + ("00"+_theDate.getDate()).slice(-2),
      ptsDetails:{},
      ptsTotal:0
    };


  }

  componentDidMount() {

    this.ptsRef = _const.fbDb.ref().child('pts').child(this.uid);

    this.ptsRef.on('value', snapPts => {
      console.log('snapPts', snapPts.val());
      if(snapPts.val()) {
        this.setState({ptsDetails : snapPts.val()}, ()=> {
          this.countPts();
        });
      }
      
    });

  }
  countPts() {
    let _total = Object.keys(this.state.ptsDetails).reduce((total, yearKey) => {
      
      let _year = this.state.ptsDetails[yearKey];
      console.log('_year', _year);

      let _totalYears = Object.keys(_year).reduce((yearTotal, monthKey) => {
        let _month = _year[monthKey];
        console.log('_month', _month);
  
        let _totalMonths = Object.keys(_month).reduce((monthTotal, dayKey) => {
          let _day = _month[dayKey];
          console.log('_day', _day);

          return monthTotal += _day.add;
        }, 0);
        return yearTotal += _totalMonths;
      }, 0);

      return total + _totalYears;
    }, 0);
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