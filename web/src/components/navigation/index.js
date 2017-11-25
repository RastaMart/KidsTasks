import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './index.css';

class Navigation extends Component {

    ComponentDidMount() {

    }

    render() {
        return (
            <div id="navigation">
                <ul id='menu'>
                    <li>
                        <Link to='/list'>
                            <i className="fa fa-list-ul"></i>
                            <span>Listes</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='/templates'>
                            <i className="fa fa-user" aria-hidden="true"></i>
                            <span>Modèles</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='/profil'>
                            <i className="fa fa-user" aria-hidden="true"></i>
                            <span>Profil</span>
                        </Link>
                    </li>
                </ul>
                {/*<ul id='Menu'>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/my'>My</Link></li>
                </ul>

                {(this.props.user != null) ?
                    <ul id='UserMenu'>
                        <li>
                            {this.props.user.displayName}
                            <img className='profilPict' src={this.props.user.photoURL} alt={this.props.user.displayName} />
                        </li>
                        <li><a href="#" id="logoutBtn" className='hide'>Logout</a></li>
                    </ul>
                    :
                    <ul id='UserMenu'>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                }*/}

            </div>
        )
    }
}

export default Navigation;