import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import logo from '../images/icon.png';

const styles = {
  form: {
    textAlign: 'center',
  },
  image:{
    margin:'20px auto 20px auto'
  },
  button: {
    marginTop: 20,
    position: "relative"
  },
  title: {
    margin:'10px auto 10px auto'
  },
  textField: {
    margin:'10px auto 10px auto'
  }, 
  custonError: {
    color:'red',
    fontSize: '0.8rem',
    marginTop: '10px',
  },
  progress: {
    position: "absolute"
  }
}

function Registro({classes, history}){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState({})
  
  const  handleSubmit = (event) =>{
      event.preventDefault();
      setLoading(true)
      const novoDados = {
        email,
        senha: password,
        confirma: confirmPassword,
        handle
      }
      axios.post("/registrar", novoDados)
        .then(res => {
          localStorage.setItem('FBidToken', `Bearer ${res.data.token}`)
          setLoading(false)
          history.push('/')
        })
        .catch(erro => {
          setErros(erro.response.data)
          setLoading(false)
        })
    }

    return (
      <Grid container className = {classes.form} >
        <Grid item sm />
        <Grid item sm >
          <img src = {logo} alt ="imagen" className = {classes.image}/>
          <Typography variant = "h2" className = {classes.title}>
            Registrar
          </Typography>
          <form noValidate onSubmit = {handleSubmit}>
            <TextField id = 'email' name ='email' type = 'email' label = 'Email' className = {classes.testField} 
                helperText = {erros.email} error = {erros.email ? true: false} 
                value = {email} onChange = {event => setEmail(event.target.value)} fullWidth/>

             <TextField id = 'password' name = 'password' type = 'password' 
                label ='Senha' className = {classes.testField} 
                helperText = {erros.senha} error = {erros.senha ? true: false} 
                value = {password} onChange = {event => setPassword(event.target.value)} fullWidth/>

            <TextField id = 'confirmPassword' name = 'confirmPassword' type = 'password' 
                label ='Confirma Senha' className = {classes.testField} 
                helperText = {erros.confirmPassword} error = {erros.confirmPassword ? true: false} 
                value = {confirmPassword} onChange = {event => setConfirmPassword(event.target.value)} fullWidth/>

             <TextField id = 'handle' name = 'handle' type = 'text' 
                label ='Handle' className = {classes.testField} 
                helperText = {erros.handle} error = {erros.handle ? true: false} 
                value = {handle} onChange = {event => setErros(event.target.value)} fullWidth/>

            {erros.general && (
              <Typography variant = 'body2' className = {classes.custonError}> {erros.general} </Typography>
            )}
            <Button type = 'submit' variant = 'contained' color = "primary" 
                className = {classes.button} disabled = {loading}>  
                Registre-se            
                 {loading && (<CircularProgress size = {30}className = {classes.progress}/>)}
            </Button>
            <br/>
            <small> Não tem uma conta? registre-se <Link to = "/login">  Aqui </Link> </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    )
  }

Registro.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(Registro);
