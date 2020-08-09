// import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Pathfinder from './pages/pathfinder';
import Login from './pages/login';
import Dashboard from './pages/dashboard'

function isLoggedIn() {
    const token = localStorage.getItem('token');
    return token !== null;
}

function App() {
    return (
        <Router>
            <Route exact path="/login" component={Login} />
            <Route exact path="/" render={() => (
                !isLoggedIn() ? (
                    <Redirect to="/login" />
                ) : (
                    <Dashboard />
                )
            )}/>
            <Route exact path="/pathfinder" render={() => (
                !isLoggedIn() ? (
                    <Redirect to="/login" />
                ) : (
                    <Pathfinder />
                )
            )}/>
        </Router>
    );
}

export default App;
