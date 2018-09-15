import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ThreeScene from './component/glp'

class App extends Component {
  render() {
    return (
      <div className="App">
          <header className='App-header'>
              <h2 className='App-title'>ReactEarth</h2>
          </header>
          <div className='renderport'>
              <ThreeScene rwidth={100} rheight={100}/>
          </div>
      </div>
    );
  }
}

class rendercontainer{
    render(){
        <ThreeScene rwidth={100} rheight={100}/>
    }
}

export default App;
