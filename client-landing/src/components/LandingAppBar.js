import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleMobileOpen } from '../actions';
import queryString from "query-string";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/core/styles';

import logo from '../images/logo.png';
import constants from '../constants';

import Button from "@material-ui/core/Button";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  grow: {
    flexGrow: 1,
    marginTop: '3px',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  navIconHide: {
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
},
});

function Login(props) {
    if (props.username.user) {
        return (
            <div>
                Welcome {props.username.user},
                <a
                    style={{textDecoration: 'underline', cursor: 'pointer', padding: 3}}
                    href={constants.LOGOUT_URL}>
                    Logout
                </a>
            </div>
        )
    } else {
        return (
            <Button variant="raised" color="primary" href={constants.LOGIN_URL} style={{margin:1}}>
                Login
                <AccountCircle style={{margin: 1}}/>
            </Button>
        )
    }
}

class LandingAppBar extends Component {
  state = {
    anchorEl: null
  };

  render() {
    const { classes, handleDrawerToggle } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
      const username = queryString.parse(window.location.search);
      console.log("parsed user name is " + username.user);
    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>

              <div className={classes.grow}>
                <img src={logo} height={32} alt="logo"/>
              </div>
              <div>
                  <Login username={username}/>
              </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

LandingAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({...state});

const mapDispatchToProps = dispatch => ({
  handleDrawerToggle: () => dispatch(toggleMobileOpen()),
});

const MappedLandingAppBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingAppBar);

export default withStyles(
  styles,
  {withTheme: true}
)(MappedLandingAppBar);
