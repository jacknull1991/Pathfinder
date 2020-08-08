import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Pathfinder from './pathfinder';
import Login from './components/login';

function App() {
  return (
    // <div className="App">
    //   <Pathfinder></Pathfinder>
    // </div>
    <Router>
        <Route path="/" exact component={Login} />
        <Route path="/pathfinder" exact component={Pathfinder} />
    </Router>
  );
}

export default App;
