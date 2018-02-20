import React, { Component } from 'react';
import ContextualisedDate from '../ContextualisedDate';
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
      <div className="ptsHistory">
        <h2>Historique</h2>
        {Object.keys(this.state.ptsDetails).sort().reverse().map((yearKey)=> {
          let year = this.state.ptsDetails[yearKey];
          return (
            <div className="year" key={yearKey}>
              {Object.keys(year).sort().reverse().map((monthKey) => {
                let month = year[monthKey];
                return (
                  <div className="month" key={monthKey}>
                    {/* <h3>{yearKey} / {monthKey}</h3> */}
                    <h3>{new Date(yearKey, monthKey-1, 1).toLocaleDateString('fr-CA', {year:"numeric", month: "long"})}</h3>
                    <div>
                      {Object.keys(month).sort().reverse().map((dateKey) => {
                        let date = month[dateKey];
                        return (
                          <div class="date" key={dateKey}>
                            
                            <ContextualisedDate date={new Date(yearKey, monthKey-1, dateKey)} />

                            <span className="rightZone">
                              {/* <span className="earn">{date.add?date.add:0} pts</span>
                              <span className="spent">{date.remove?date.remove:0} pts</span> */}
                              <span className="earn">+ {date.add?date.add:0}</span>
                              <span className="spent">- {date.remove?date.remove:0}</span>
                              <span className="total">{(date.add?date.add:0)-(date.remove?date.remove:0)} pts</span>
                            </span>
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
