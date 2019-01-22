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

import CircularProgress from '@material-ui/core/CircularProgress';
import { palette } from "./App";

const styles = theme => ({
    progress: {position: 'relative', top: 300, left: 200}
});

class LandingMain extends Component {

    componentDidMount() {
        this.props.handleLogin();
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
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: 30,
                        display: 'block',
                        color: palette.white,
                        fontSize: 10,
                        margin: '0px 50px 0px 0px',
                        padding: 5,
                        backgroundColor: palette.blue,
                    }}>
                        CyVerse is funded by a grant from the National Science Foundation Plant Science
                        Cyberinfrastructure Collaborative (#DBI-0735191, #DBI-1265383).
                    </div>
                </LandingResponsiveDrawer>
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
