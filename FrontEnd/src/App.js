import React, {useEffect, useState} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import jwtDecoder from 'jwt-decode';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import NavBar from './components/NavBar';
import home from './pages/Home';
import login from './pages/Login';
import registro from './pages/Registro';
import AuthRoute from './util/AuthRoute'
import tema from './util/theme';
import './App.css';

const theme = createMuiTheme(tema);

export default function App() {
  const token = localStorage.FBidToken
  const [authenticated, setAuthenticated] = useState(false)
  useEffect(()=>{
    if (token){
      const decodedToken = jwtDecoder(token) 
      if (decodedToken.exp * 1000 < Date.now()){
          //window.location.href = '/login'
          setAuthenticated(false)
      }else{
        setAuthenticated(true)
      }
      console.log(decodedToken)
    }  
  },[authenticated, token])
  
  return (
    <MuiThemeProvider theme= {theme}>
      <div className="App">
        <BrowserRouter> 
          <NavBar/>
          <div className="container">
            <Switch>
              <Route exact path = "/" component = {home}/>
              <AuthRoute authenticated={authenticated} exact path = "/login" component = {login} />
              <AuthRoute  authenticated={authenticated} exact path = "/registrar" component = {registro}/>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </MuiThemeProvider>
  );
};
