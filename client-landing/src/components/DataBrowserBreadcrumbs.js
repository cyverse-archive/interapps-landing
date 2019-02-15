import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const styles = theme => ({
  root: {
    justifyContent: 'center',
  },
  paper: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    borderRadius: '0',
    overflowWrap: 'anywhere',
    boxShadow: '0 0 0 0'
  },
});

class DataBrowserBreadcrumbs extends React.Component {
  splitIntoLinkables() {
    const { currentDirectory } = this.props;
    return currentDirectory.split('/').filter(l => l !== "");
  }

  render() {
    const { classes } = this.props;
    const linkables = this.splitIntoLinkables();

    return (
      <Paper className={classes.paper}>
        <Breadcrumbs
          maxItems={2}
          itemsAfterCollapse={2}
          itemsBeforeCollapse={3}
          arial-label="Data Browser Breadcrumbs"
        >
          {linkables.map((linkable, index) => {
            return (
              <Link color="inherit" href="#" onClick={() => this.props.crumbcallback(linkables, index)}>
                {linkable}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Paper>
    )
  }
}

DataBrowserBreadcrumbs.propTypes = {
  classes:           PropTypes.object.isRequired,
  currentDirectory:  PropTypes.string.isRequired,
  crumbcallback:     PropTypes.func.isRequired,
};

export default withStyles(styles)(DataBrowserBreadcrumbs);
