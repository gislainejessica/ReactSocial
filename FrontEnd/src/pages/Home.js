import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Tela from '../components/Tela';

export default function Home(){
  const [rtelas, setTelas] = useState([]);

  useEffect(() => {
    axios.get("/telas")
      .then(res => { 
          setTelas(res.data)
      })
      .catch(erro => {
        console.error(erro)
      })
  },[]);
  
  return (
    <Grid container>
      <Grid item sm = {8} xs = {12}>
        { rtelas 
          ? (rtelas.map(tela => <Tela key = {tela.telaId} tela = {tela}/>))
          : <p> Loading... </p>
        }
      </Grid>
      <Grid item sm = {4} xs = {12}>
        <p> Perfil </p>
      </Grid>
    </Grid>
  )
};
