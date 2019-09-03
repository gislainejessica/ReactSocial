import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Link from 'react-router-dom/Link'


const style = {
  card:{
    display:  'flex',
    marginBottom: 20
  },
  image:{
    minWidth: 200
  },
  content:{
    padding: 25,
    objectFit:"cover"
  }
}

class Tela extends Component {
  render() {
    const {classes, tela: {body, createAt, userHandle, imageUrl}} = this.props
    
    return ( 
      <Card className = {classes.Card}>
        <CardMedia className = {classes.image} image = {imageUrl} title = 'Imagem Perfil' />
        <CardContent className = {classes.content}>
          <Typography variant= 'h5'  color = 'primary' component = {Link} to = {`/user/${userHandle}`}> {userHandle} </Typography>
          <Typography variant= 'body2' color ='textSecundary'> {createAt} </Typography>
          <Typography variant= 'body1'> {body} </Typography>
        </CardContent>
      </Card>
    )
  }
};

export default withStyles(style)(Tela);