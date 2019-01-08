import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loggedIn, ShowApps, ShowCompleted, ShowError, ShowFailed, ShowRunning } from '../actions';

import { withStyles } from '@material-ui/core/styles';

import LandingAppBar from './LandingAppBar';
import LandingResponsiveDrawer from './LandingResponsiveDrawer';
import AnalysisCardGrid from './AnalysisCardGrid';
import AppCardGrid from './AppCardGrid';
import ErrorCard from './ErrorCard';
import queryString from "query-string";

import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    progress: {position: 'relative', top: 300, left: 200}
});

class LandingMain extends Component {

    componentDidMount() {
        const username = queryString.parse(window.location.search);
        this.props.handleLogin(username.user);
        console.log("parsed user name is " + username.user);
    }

    render() {
        const {
            pageToShow,
            analyses,
            apps,
            handleLogin,
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
                </LandingResponsiveDrawer>
            </div>
        )
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
    handleLogin: (username) => dispatch(loggedIn(username)),
});

const MappedLandingMain = connect(
    mapStateToProps,
    mapDispatchToProps
)(LandingMain);

export default withStyles(
    styles,
    {withTheme: true}
)(MappedLandingMain);
