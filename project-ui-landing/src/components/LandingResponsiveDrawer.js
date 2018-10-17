// React/Redux imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  toggleMobileOpen,
  setPageToShow,
  ShowRunning,
  ShowFinished,
  ShowApps
} from '../actions';

// Material UI Imports
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';

// Components imports
import NavList from './NavList';
import LandingAppBar from './LandingAppBar';

// Adapted from the examples at https://material-ui.com/demos/drawers/#responsive-drawer

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
    borderRight: '0px',
  },
  navListPermanent: {
    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
});

class LandingResponsiveDrawer extends Component {
  render() {
    const {
      classes,
      theme,
      children,
      mobileOpen,
      handleClickApps,
      handleClickFinished,
      handleClickRunning,
      handleDrawerToggle,
    } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <NavList
          handleClickApps={handleClickApps}
          handleClickFinished={handleClickFinished}
          handleClickRunning={handleClickRunning}
        />
      </div>
    );

    return (
      <div className={classes.root}>
        <Hidden mdUp className={classes.navListTemp}>
         <Drawer
           variant="temporary"
           anchor={theme.direction === 'rtl' ? 'right' : 'left'}
           open={this.mobileOpen}
           onClose={handleDrawerToggle}
           classes={{
             paper: classes.drawerPaper,
           }}
           ModalProps={{
             keepMounted: true, // Better open performance on mobile.
           }}
         >
           {drawer}
         </Drawer>
       </Hidden>

       <Hidden smDown implementation="css" className={classes.navListPermanent}>
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          {children}
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({ mobileOpen: state.mobileOpen });

const mapDispatchToProps = dispatch => ({
  handleDrawerToggle:  () => dispatch(toggleMobileOpen()),
  handleClickApps:     () => dispatch(setPageToShow(ShowApps)),
  handleClickFinished: () => dispatch(setPageToShow(ShowFinished)),
  handleClickRunning:  () => dispatch(setPageToShow(ShowRunning)),
});

LandingResponsiveDrawer.propTypes = {
  classes:             PropTypes.object.isRequired,
  theme:               PropTypes.object.isRequired,
};

const MappedLandingResponsiveDrawer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingResponsiveDrawer)

export default withStyles(
  styles,
  { withTheme: true }
)(MappedLandingResponsiveDrawer);
