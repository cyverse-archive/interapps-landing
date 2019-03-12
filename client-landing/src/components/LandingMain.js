import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchProfile, ShowApps, ShowCompleted, ShowError, ShowFailed, ShowRunning } from '../actions';

import { withStyles } from '@material-ui/core/styles';

import LandingAppBar from './LandingAppBar';
import LandingResponsiveDrawer from './LandingResponsiveDrawer';
import AnalysisCardGrid from './AnalysisCardGrid';
import AppCardGrid from './AppsCardGrid';
import ErrorCard from './ErrorCard';
import ErrorDialog from './ErrorDialog';
import MessageSnackbars from './MessageSnackbars';

import CircularProgress from '@material-ui/core/CircularProgress';
import { palette } from "./App";
import {mediaQueryList, handleDeviceChange} from "../mediaQuery";

const styles = theme => ({
    progress: {position: 'absolute', top: '50%', left: '50%'}
});

class LandingMain extends Component {

    componentDidMount() {
        this.props.handleLogin();
        handleDeviceChange(mediaQueryList);
    }

    render() {
        const {
            pageToShow,
            httpCode,
            loading,
            classes
        } = this.props;

        let mainContent;

        switch (pageToShow) {
            case ShowRunning:
                mainContent = (
                    <AnalysisCardGrid/>
                );
                break;
            case ShowCompleted:
                mainContent = (
                    <AnalysisCardGrid/>
                );
                break;
            case ShowFailed:
                mainContent = (
                    <AnalysisCardGrid/>
                );
                break;
            case ShowApps:
                mainContent = (
                    <AppCardGrid/>
                );
                break;
            case ShowError:
                mainContent = (
                    <ErrorCard httpCode={httpCode}/>
                );
                break;
            default:
                console.log('unknown value for pageToShow');
        }

        return (
            <div>
                <LandingAppBar/>
                <LandingResponsiveDrawer>
                    {loading &&
                    <CircularProgress color="primary" className={classes.progress}/>
                    }
                    {mainContent}
                    <ErrorDialog />
                    <MessageSnackbars />
                </LandingResponsiveDrawer>
                <div style={{
                    position: 'fixed',
                    diplay: 'block',
                    bottom: '0',
                    color: palette.white,
                    width: '100%',
                    height: 30,
                    fontSize: 10,
                    textAlign: "center",
                    margin: '0px 50px 0px 0px',
                    padding: 5,
                    backgroundColor: palette.blue,
                    zIndex: 9999,
                }}>
                    CyVerse is funded by a grant from the National Science Foundation Plant Science
                    Cyberinfrastructure Collaborative (#DBI-0735191, #DBI-1265383).
                </div>
            </div>
        );
    }
}

LandingMain.propTypes = {
    classes: PropTypes.object.isRequired,
    analyses: PropTypes.object.isRequired,
    apps: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    pageToShow: state.pageToShow,
    analyses: state.analyses,
    apps: state.apps,
    httpCode: state.httpCode,
    loading: state.loading,
});


const mapDispatchToProps = dispatch => ({
    handleLogin: (username) => dispatch(fetchProfile()),
});

const MappedLandingMain = connect(
    mapStateToProps,
    mapDispatchToProps
)(LandingMain);

export default withStyles(
    styles,
    {withTheme: true}
)(MappedLandingMain);
