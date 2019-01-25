// React/Redux imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleDrawerOpen } from '../actions';

// Material UI Imports
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

// Components imports
import NavList from './NavList';

// Adapted from the examples at https://material-ui.com/demos/drawers/#responsive-drawer

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    minHeight: '100vh',
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'fixed',
    },
  },
  navListPermanent: {
    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    minWidth: 0, // So the Typography noWrap works
    [theme.breakpoints.up('md')]: {
      paddingLeft: drawerWidth,
    },
  },
  toolbar: theme.mixins.toolbar
});

class LandingResponsiveDrawer extends Component {
  render() {
    const {
      classes,
      theme,
      children,
      drawerOpen,
      handleDrawerToggle,
    } = this.props;

    const drawer = (
      <div>
        <NavList />
      </div>
    );

    return (
      <div className={classes.root}>
        <Hidden mdUp className={classes.navListTemp}>
         <Drawer
           variant="temporary"
           anchor={theme.direction === 'rtl' ? 'right' : 'left'}
           open={drawerOpen}
           onClose={handleDrawerToggle}
           classes={{
             paper: classes.drawerPaper,
           }}
           ModalProps={{
             keepMounted: true,
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
            <div className={classes.toolbar} />
            {drawer}
          </Drawer>
        </Hidden>

        <main className={classes.content}>
          <div className={classes.toolbar} />
          {children}
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({ mobileOpen: state.drawerOpen });

const mapDispatchToProps = dispatch => ({
  handleDrawerToggle:   () => dispatch(toggleDrawerOpen()),
});

LandingResponsiveDrawer.propTypes = {
  classes:             PropTypes.object.isRequired,
  theme:               PropTypes.object.isRequired,
};

const MappedLandingResponsiveDrawer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingResponsiveDrawer);

export default withStyles(
  styles,
  { withTheme: true }
)(MappedLandingResponsiveDrawer);
