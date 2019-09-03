import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Tela from '../components/Tela';
export default class home extends Component {
  state = {
    telas : null
  };

  componentDidMount(){
    axios.get('/telas')
      .then(res => { 
        this.setState({
          telas: res.data
        })
      })
      .catch(erro => {
        console.error(erro)
      })
  }
  render() {
    let recentTelasMarcada = this.state.telas ? (
      this.state.telas.map(tela => <Tela tela = {tela}/>)
    ): <p> Loading... </p>
    return (
    <Grid container spacing = {16} >
      <Grid item sm = {8} xs = {12}>
       {recentTelasMarcada}
      </Grid>
      <Grid item sm = {4} xs = {12}>
        <p> Perfil </p>
      </Grid>
    </Grid>
    );
  }
};
