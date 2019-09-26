import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NavBar from './components/NavBar';
import home from './pages/home';
import login from './pages/login';
import registro from './pages/registro';

import  MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import tema from './util/theme'

const theme = createMuiTheme(tema);

export default function App() {
  return (
    <MuiThemeProvider theme= {theme}>
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
    </MuiThemeProvider>
  );
};
