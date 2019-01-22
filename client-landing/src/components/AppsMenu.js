/**
 *  @author sriram
 *
 **/
import React, { Component } from 'react';

import Menu from "@material-ui/core/Menu";

import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/es/MenuItem/MenuItem";

import InfoIcon from "@material-ui/icons/Info";
import palette from "./App";

const ITEM_HEIGHT = 48;

class AppsMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
    }

    handleDotMenuClick = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleDotMenuClose = () => {
        this.setState({anchorEl: null});
    };

    handleAppsInfoClick = () => {
       this.handleDotMenuClose();
       this.props.onInfoClick();
    };


    render() {
        const {anchorEl} = this.state;
        const open = Boolean(anchorEl);
        return (
            <div>
                <IconButton
                    aria-label="More"
                    aria-owns={open ? 'long-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleDotMenuClick}
                >
                    <MoreVertIcon/>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={this.handleDotMenuClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: 200,
                        },
                    }}
                >
                    <MenuItem onClick={this.handleAppsInfoClick}>
                        <InfoIcon style={{color: palette.darkBlue}}/>
                            Info
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

export default AppsMenu;