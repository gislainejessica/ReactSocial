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
import CircularProgress from '@material-ui/core/CircularProgress';

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

class login extends Component {
  constructor(){
    super()
    this.state ={
      email:'',
      password:'',
      loading: false,
      erros:{},
    }
  }
  handleSubmit = (event) =>{
    event.preventDefault();
    this.setState({
      loading : true
    })
    const dadosUser = {
      email: this.state.email,
      senha: this.state.password
    }
    axios.post('/login', dadosUser)
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
            Login
          </Typography>
          <form noValidate onSubmit = {this.handleSubmit}>
            <TextField id = 'email' name ='email' type = 'email' label = 'Email' className = {classes.testField} 
                helperText = {erros.email} error = {erros.email ? true: false} 
                value = {this.state.email} onChange = {this.handleChange} fullWidth/>

             <TextField id = 'password' name = 'password' type = 'password' 
                label ='Senha' className = {classes.testField} 
                helperText = {erros.senha} error = {erros.senha ? true: false} 
                value = {this.state.password} onChange = {this.handleChange} fullWidth/>

            {erros.general && (
              <Typography variant = 'body2' className = {classes.custonError}> {erros.general} </Typography>
            )}
            <Button type = 'submit' variant = 'contained' color = "primary" 
                className = {classes.button} disabled = {loading}>  
                Login            
                 {loading && (<CircularProgress size = {30}className = {classes.progress}/>)}
            </Button>
            <br/>
            <small> Já tens um conta faça o login <Link to = "/registr µ──────ar">  Aqui </Link> </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    )
  }
}
login.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(login);
