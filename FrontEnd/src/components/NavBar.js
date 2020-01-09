import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import ToolBar from '@material-ui/core/Toolbar'

export default class NavBar extends Component {
  render() {
    return (
        <AppBar>
            <ToolBar className = 'nav-container'>
                <Button color = 'inherit' component={Link} to='/'> Home </Button>
                <Button color = 'inherit' component={Link} to='/login'> Login </Button>
                <Button color = 'inherit' component={Link} to='/registrar'> Registrar </Button>
            </ToolBar>
        </AppBar>
    )
  }
}
