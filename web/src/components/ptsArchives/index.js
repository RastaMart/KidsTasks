import React, { Component } from 'react';

import _const from '../../const';

import './index.css';

class PtsArchives extends Component {

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
        this.setState({ptsDetails : snapPts.val()});
      }
      
    });

  }

  componentWillUnmount() {
  }


  render() {
    return (
      <div className="ptsArchives">
        <h2>Archives</h2>
        {Object.keys(this.state.ptsDetails).sort().reverse().map((yearKey)=> {
          let year = this.state.ptsDetails[yearKey];
          console.log('year', year);
          return (
            <div className="year" key={yearKey}>
              {Object.keys(year).sort().reverse().map((monthKey) => {
                let month = year[monthKey];
                console.log('month', month);
                return (
                  <div className="month" key={monthKey}>
                    <h3>{yearKey} / {monthKey}</h3>
                    <div>
                      {Object.keys(month).sort().reverse().map((dateKey) => {
                        let date = month[dateKey];
                        console.log('date', date);
                        return (
                          <div class="date" key={dateKey}>
                            <p>
                              {_const.dayOfWeek[ new Date(yearKey, monthKey-1, dateKey).getDay()]}
                              {" "}
                              {dateKey} 
                              {" "}
                              {date.add?date.add:0} -{date.remove?date.remove:0} = {(date.add?date.add:0)-(date.remove?date.remove:0)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        })}
      </div>
    );
  }
}

export default PtsArchives;
