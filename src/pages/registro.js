import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import logo from '../images/icon.png';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress'

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

class registro extends Component {
  constructor(){
    super()
    this.state ={
      email:'',
      password:'',
      confirmPassword:'',
      handle:'',
      loading: false,
      erros:{},
    }
  }
  handleSubmit = (event) =>{
    event.preventDefault();
    this.setState({
      loading : true
    })
    const novoDados = {
      email: this.state.email,
      senha: this.state.password,
      confirma: this.state.confirmPassword,
      handle: this.state.handle
    }
    axios.post('/registrar', novoDados)
      .then(res => {
        console.log(res.data)
        localStorage.setItem('FBidToken', `Bearer ${res.data.token}`)
        this.setState({
          loading : false
        })
        this.props.history.push('/')
      })
      .catch(erro => {
        this.setState({
          error: erro.response.data,
          loading: false
        })
      })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    })
  }
  render() {
    const {classes} = this.props
    const {erros, loading} = this.state
    return (
      <Grid container className = {classes.form} >
        <Grid item sm />
        <Grid item sm >
          <img src = {logo} alt ="imagen" className = {classes.image}/>
          <Typography variant = "h2" className = {classes.title}>
            Registrar
          </Typography>
          <form noValidate onSubmit = {this.handleSubmit}>
            <TextField id = 'email' name ='email' type = 'email' label = 'Email' className = {classes.testField} 
                helperText = {erros.email} error = {erros.email ? true: false} 
                value = {this.state.email} onChange = {this.handleChange} fullWidth/>

             <TextField id = 'password' name = 'password' type = 'password' 
                label ='Senha' className = {classes.testField} 
                helperText = {erros.senha} error = {erros.senha ? true: false} 
                value = {this.state.password} onChange = {this.handleChange} fullWidth/>

            <TextField id = 'confirmPassword' name = 'confirmPassword' type = 'password' 
                label ='Confirma Senha' className = {classes.testField} 
                helperText = {erros.confirmPassword} error = {erros.confirmPassword ? true: false} 
                value = {this.state.confirmPassword} onChange = {this.handleChange} fullWidth/>

             <TextField id = 'handle' name = 'handle' type = 'text' 
                label ='Handle' className = {classes.testField} 
                helperText = {erros.handle} error = {erros.handle ? true: false} 
                value = {this.state.handle} onChange = {this.handleChange} fullWidth/>

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
}
registro.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(registro);
