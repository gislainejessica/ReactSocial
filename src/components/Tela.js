import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import dayjs from 'dayjs';
import tempoRelativo from 'dayjs/plugin/relativeTime';

import { Link } from 'react-router-dom';

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
    dayjs.extend(tempoRelativo) 
    const  {classes, tela: {body, createAt, userHandle, userImage}} = this.props  
    return ( 
      <Card className = {classes.card}>
        <CardMedia className = {classes.image} image = {userImage} title = "Imagem Perfil" />
        <CardContent className = {classes.content}>
          <Typography variant= "h5"  color = "primary" component = {Link} to = {`/user/${userHandle}`}> {userHandle} </Typography>
          <Typography variant= "body2" color ="textSecondary"> {dayjs(createAt).fromNow()} </Typography>
          <Typography variant= "body1"> {body} </Typography>
        </CardContent>
      </Card>
    )
  }
};
 

export default withStyles(style)(Tela);