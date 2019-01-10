import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { StatusCompleted, StatusRunning } from '../actions';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Assessment from '@material-ui/icons/Assessment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

import { palette } from './App';

const styles = theme => ({
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    card: {
        width: 300,
    },
    runningAnalysisAvatar: {
        backgroundColor: palette.lightGreen,
    },
    completedAnalysisAvatar: {
        backgroundColor: palette.blue,
    },
    failedAnalysisAvatar: {
        backgroundColor: palette.red,
    },
    field: {
        marginBottom: "1em",
    },
    descField: {
        width: "100%",
    },
    overflow: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        maxWidth: 100,
    }
});

class AnalysisCard extends Component {
    state = { expanded: false };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    handleClickAnalysisLink = () => {
        window.open(this.props.analysisLink, "_blank");
    };

    render() {
        const {
            classes,
            appName,
            analysisName,
            owner,
            description,
            startDate,
            plannedEndDate,
            status
        } = this.props;


        let avatarClass;

        switch (status) {
            case StatusRunning:
                avatarClass = classes.runningAnalysisAvatar;
                break;
            case StatusCompleted:
                avatarClass = classes.completedAnalysisAvatar;
                break;
            default:
                avatarClass = classes.failedAnalysisAvatar;
        }

        return (
            <div className={classes.card}>
                <Card>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="Running analysis" className={avatarClass}>
                                <Assessment />
                            </Avatar>
                        }
                        title={<span title={analysisName} className={classes.overflow}>{analysisName}</span>}
                        subheader={<span title={appName} className={classes.overflow}>{appName}</span>}
                    />

                    <Divider light />

                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Status
                        </Typography>
                        <Typography className={classes.field} gutterBottom>
                            {status}
                        </Typography>

                        <Typography color="textSecondary" gutterBottom>
                            Submitted By
                        </Typography>
                        <Typography className={classes.field} gutterBottom>
                            {owner}
                        </Typography>

                        <Typography color="textSecondary" gutterBottom>
                            Launch Date
                        </Typography>
                        <Typography className={classes.field} gutterBottom noWrap>
                            {startDate}
                        </Typography>

                        <Typography color="textSecondary" gutterBottom>
                            Scheduled End Date
                        </Typography>
                        <Typography className={classes.field} gutterBottom noWrap>
                            {plannedEndDate}
                        </Typography>
                    </CardContent>

                    <Divider light />

                    <CardActions disableActionSpacing>
                        <IconButton onClick={this.handleClickAnalysisLink}>
                            <OpenInBrowser />
                        </IconButton>

                        <IconButton
                            className={classnames(classes.expand, {
                                [classes.expandOpen]: this.state.expanded,
                            })}
                            onClick={this.handleExpandClick}
                            aria-expanded={this.state.expanded}
                            aria-label="Show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </CardActions>

                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Description
                            </Typography>
                            <Typography className={classes.descField}>
                                {description}
                            </Typography>
                        </CardContent>
                    </Collapse>
                </Card>
            </div>
        );
    }
}

AnalysisCard.propTypes = {
    classes:        PropTypes.object.isRequired,
    analysisName:   PropTypes.string.isRequired,
    appName:        PropTypes.string.isRequired,
    owner:          PropTypes.string.isRequired,
    description:    PropTypes.string,
    startDate:      PropTypes.number.isRequired,
    plannedEndDate: PropTypes.number.isRequired,
    analysisLink:   PropTypes.string.isRequired,
    status:         PropTypes.string.isRequired,
};

export default withStyles(
    styles,
    { withTheme: true }
)(AnalysisCard);
