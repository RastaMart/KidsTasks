import React, { Component } from 'react';
import _const from '../../const';
//import { Link } from 'react-router-dom';

class ContextualisedDate extends Component {

    constructor(props) {
        super(props);

        let theDate = this.props.date;
        let theDateRounded = new Date(theDate.setHours(0,0,0,0));
        let dateString = this.props.date.toLocaleDateString('fr-CA');

        let today = new Date(
            new Date().setHours(0,0,0,0)
        );
        let yesterday = new Date(
            new Date(
                new Date().setDate(
                    new Date().getDate()-1
                )
            ).setHours(0,0,0,0)
        );
        let weekAgo = new Date(
            new Date(
                new Date().setDate(
                    new Date().getDate()-7
                )
            ).setHours(0,0,0,0)
        );

        if(theDateRounded.toString() === today.toString()) {
            dateString = "aujourd'hui";
        } else if(theDateRounded.toString() === yesterday.toString()) {
            dateString = "hier";
        }
        else if(theDateRounded - weekAgo > 0) {
            dateString = _const.dayOfWeek[ theDateRounded.getDay()];
        }

        this.state = {
            date:this.props.date,
            dateString:dateString
        }
        
    }
    componentDidMount() {
        
    }

    render() {
        return (
            <span>
                {this.state.dateString} 
            </span>
        )
    }
}

export default ContextualisedDate;