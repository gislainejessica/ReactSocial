import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar'
import home from './pages/home'
import login from './pages/login'
import registro from './pages/registro'

export default function App() {
  return (
    <div className="App">
      <BrowserRouter> 
        <NavBar/>
        <div className="container">
          <Switch>
            <Route exact path = '/' component = {home}/>
            <Route exact path = '/login' component = {login}/>
            <Route exact path = '/registrar' component = {registro}/>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};