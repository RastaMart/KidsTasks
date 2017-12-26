import React, { Component } from 'react';

import _const from '../../const';

import './index.css';

class PtsTile extends Component {

  constructor(props) {
    super(props);
    this.skipToday = this.props.skipToday || false;
    this.uid = this.props.uid;

    this.theDate = new Date();
    this.year = this.theDate.getFullYear();
    this.month = this.theDate.getMonth() + 1;
    this.date = this.theDate.getDate();

    this.state = {
      ptsDetails:{},
      ptsTotal:0
    };


  }

  componentDidMount() {

    this.ptsRef = _const.fbDb.ref().child('pts').child(this.uid);

    this.ptsRef.on('value', snapPts => {
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

      let _totalYears = Object.keys(_year).reduce((yearTotal, monthKey) => {
        let _month = _year[monthKey];
  
        let _totalMonths = Object.keys(_month).reduce((monthTotal, dateKey) => {
          let _date = _month[dateKey];

          let _add = _date.add || 0;
          let _remove = _date.remove || 0;

          if(this.skipToday && this.year === yearKey*1 && this.month === monthKey*1 && this.date === dateKey*1) {
            _remove = 0;
          }

          return monthTotal += (_add - _remove);
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
          <div className="ptsTotal">{this.state.ptsTotal}</div>
    );
  }
}

export default PtsTile;
