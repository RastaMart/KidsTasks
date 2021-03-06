import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './index.css';

class Navigation extends Component {

    ComponentDidMount() {

    }

    render() {
        return (
            <div id="navigation">
                
                    {
                        (!this.props.user || !this.props.user.familyMemberType) ? 
                        
                        <ul id='menu'>
                            <li>
                                <Link to='/profil'>
                                    <i className="fa fa-user" aria-hidden="true"></i>
                                    <span>Profil</span>
                                </Link>
                            </li>
                        </ul>
                        : 

                        (this.props.user.familyMemberType === 'parent') ? 
                        <ul id='menu'>
                            <li>
                                <Link to='/confirm'>
                                <i className="fa fa-check-square-o"></i>
                                    <span>Confirmation</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/pts'>
                                    <i className="fa fa-diamond"></i>
                                    <span>Points</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/templates'>
                                <i className="fa fa-list-ul"></i>
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
                        :
                        <ul id='menu'>
                            <li>
                                <Link to='/pts'>
                                    <i className="fa fa-diamond"></i>
                                    <span>Points</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/list'>
                                    <i className="fa fa-list-ul"></i>
                                    <span>Listes</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/profil'>
                                    <i className="fa fa-user" aria-hidden="true"></i>
                                    <span>Profil</span>
                                </Link>
                            </li>
                        </ul>
                    }
                {/*<ul id='Menu'>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/my'>My</Link></li>
                </ul>

                {(this.props.fbUser != null) ?
                    <ul id='UserMenu'>
                        <li>
                            {this.props.fbUser.displayName}
                            <img className='profilPict' src={this.props.fbUser.photoURL} alt={this.props.fbUser.displayName} />
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