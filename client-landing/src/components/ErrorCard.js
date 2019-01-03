import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/es/Paper/Paper";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class ErrorCard extends Component {

    render() {
        const {
            classes,
            httpCode
        } = this.props;
        let errorContent;
        switch (httpCode) {
            case 403:
                errorContent = "You are not authorized to view this page. Please login!";
                break;
            case 500:
                errorContent =
                    "An unexpected error has occurred while processing your request. Please try again!";
                break;
            default:
                errorContent = "Unable to process your request. Please try again!";
        }
        return (
            <Paper className={classes.root}>
                <Typography variant="h5" component="h3" color="error">
                    {errorContent}
                </Typography>
            </Paper>
        );

    }
}

export default withStyles(
    styles,
    {withTheme: true}
)(ErrorCard);