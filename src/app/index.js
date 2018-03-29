import React from 'react';
import Navigation from '../components/navigation';

import './index.css';



class App extends React.Component {
  render() {
    return (
        <div id="body">
          <Navigation fbUser={this.props.fbUser} user={this.props.user} />
          <div id="app">
            {this.props.children}
          </div>
        </div>
    )
  }
}

export default App;

