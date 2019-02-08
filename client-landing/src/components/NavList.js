import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
    fetchAnalyses,
    fetchApps,
    fetchDataResources,
    setPageToShow,
    ShowApps,
    ShowCompleted,
    ShowFailed,
    ShowRunning,
    ShowData,
    StatusCompleted,
    StatusFailed,
    StatusRunning,
} from '../actions';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Computer from '@material-ui/icons/Computer';
import Folder from '@material-ui/icons/Folder';
import Assessment from '@material-ui/icons/Assessment';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

import { palette } from './App';

// Adapted from examples at https://material-ui.com/demos/lists/#nested-list

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 6,
    },
    runningAnalysisIcon: {
        color: palette.lightGreen,
    },
    completedAnalysisIcon: {
        color: palette.blue,
    },
    failedAnalysisIcon: {
        color: palette.red,
    },
});

class AnalysesList extends Component {
    state = {
        openAnalyses: true,
    };

    handleAnalysesClick = () => {
        this.setState(state => ({openAnalyses: !state.openAnalyses}));
    };

    componentDidMount() {
        this.props.handleClickRunning();
    }

    render() {
        const {
            classes,
            pageToShow,
            handleClickRunning,
            handleClickCompleted,
            handleClickFailed,
            handleClickApps,
            handleClickData
        } = this.props;

        return (
            <div className={classes.root}>
                <List component="nav">
                    <ListItem button onClick={this.handleAnalysesClick}>
                        <ListItemIcon>
                            <Assessment/>
                        </ListItemIcon>
                        <ListItemText inset primary="Analyses"/>
                        {this.state.openAnalyses ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={this.state.openAnalyses} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button
                                      className={classes.nested}
                                      selected={pageToShow === ShowRunning}
                                      onClick={handleClickRunning}>
                                <ListItemIcon>
                                    <Assessment className={classes.runningAnalysisIcon}/>
                                </ListItemIcon>
                                <ListItemText inset primary="Running"/>
                            </ListItem>
                            <ListItem button
                                      className={classes.nested}
                                      selected={pageToShow === ShowCompleted}
                                      onClick={handleClickCompleted}>
                                <ListItemIcon>
                                    <Assessment className={classes.completedAnalysisIcon}/>
                                </ListItemIcon>
                                <ListItemText inset primary="Completed"/>
                            </ListItem>
                            <ListItem button
                                      className={classes.nested}
                                      selected={pageToShow === ShowFailed}
                                      onClick={handleClickFailed}>
                                <ListItemIcon>
                                    <Assessment className={classes.failedAnalysisIcon}/>
                                </ListItemIcon>
                                <ListItemText inset primary="Failed"/>
                            </ListItem>
                        </List>
                    </Collapse>

                    <Divider light inset/>

                    <ListItem button selected={pageToShow === ShowApps} onClick={handleClickApps}>
                        <ListItemIcon>
                            <Computer/>
                        </ListItemIcon>
                        <ListItemText inset primary="Apps"/>
                    </ListItem>

                    <ListItem button selected={pageToShow === ShowData} onClick={() => handleClickData(this.props.username)}>
                        <ListItemIcon>
                            <Folder/>
                        </ListItemIcon>
                        <ListItemText inset primary="Folder"/>
                    </ListItem>
                </List>

            </div>
        );
    };
}

AnalysesList.propTypes = {
    classes: PropTypes.object.isRequired,
    handleClickRunning: PropTypes.func,
    handleClickFinished: PropTypes.func,
    handleClickApps: PropTypes.func,
};

const mapStateToProps = state => ({
    pageToShow: state.pageToShow,
    username: state.username,
});

const mapDispatchToProps = dispatch => ({
    handleClickApps: () => {
        dispatch(setPageToShow(ShowApps));
        dispatch(fetchApps())
    },
    handleClickCompleted: () => {
        dispatch(setPageToShow(ShowCompleted));
        dispatch(fetchAnalyses(StatusCompleted))
    },
    handleClickFailed: () => {
        dispatch(setPageToShow(ShowFailed));
        dispatch(fetchAnalyses(StatusFailed))
    },
    handleClickRunning: () => {
        dispatch(setPageToShow(ShowRunning));
        dispatch(fetchAnalyses(StatusRunning))
    },
    handleClickData: (user) => {
        dispatch(setPageToShow(ShowData));
        dispatch(fetchDataResources(`/iplant/home/${user}`));
    }
});

const MappedAnalysesList = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnalysesList);

export default withStyles(styles)(MappedAnalysesList);
