import React from 'react';

import Navigation from '../components/navigation';

import './index.css';

//class App extends Component {
const App = ({children}) => {
    return (
      <div>
        <Navigation />
        <div className="App">
          {children}
        </div>
      </div>
    );
  }


export default App;
