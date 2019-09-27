import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import jwtDecoder from 'jwt-decode';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import NavBar from './components/NavBar';
import home from './pages/home';
import login from './pages/login';
import registro from './pages/registro';
import AuthRoute from './util/AuthRoute'
import tema from './util/theme';
import './App.css';

const theme = createMuiTheme(tema);
const token = localStorage.FBidToken;
let authenticated
if (token){
  const decodedToken = jwtDecoder(token) 
  if (decodedToken.exp * 1000 < Date.now()){
  //    window.location.href = '/login'
      window.location.href = '/login'
      authenticated = false
  }else{
    authenticated = true
  }
  console.log(decodedToken)
}

export default function App() {

  
  return (
    <MuiThemeProvider theme= {theme}>
      <div className="App">
        <BrowserRouter> 
          <NavBar/>
          <div className="container">
            <Switch>
              <Route exact path = '/' component = {home}/>
              <AuthRoute exact path = '/login' component = {login} authenticated={authenticated}/>
              <AuthRoute exact path = '/registrar' component = {registro} authenticated={authenticated}/>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </MuiThemeProvider>
  );
};
