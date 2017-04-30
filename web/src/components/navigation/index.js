import React, { Component } from 'react';
import { Link } from 'react-router';

import './index.css';

class Navigation extends Component {
    render() {
        return (
            <div id="Navigation">
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/my'>My</Link></li>
                </ul>
            </div>
        )
    }
}

export default Navigation;