import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import goldstar from "../../src/images/star-gold.gif";
import whitestar from "../../src/images/star-white.gif";
import redstar from "../../src/images/star-red.gif";
import Rating from "react-rating";
import md5 from "md5";
import constants from '../constants';
import AppsMenu from "./AppsMenu";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import Lock from "@material-ui/icons/Lock";
import Cancel from "@material-ui/icons/Cancel";
import { palette } from "./App";
import Beta from "../../src/images/betaSymbol.png";

const styles = theme => ({
    card: {
        width: 265,
        margin: 15,
        height: 100,
    },
    type: {
        textAlign: 'center',
        fontSize: 10,
    },
    name: {
        position: "relative",
        top: -5,
        fontSize: 12,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        maxWidth: 100,
        '&:hover': {
            textDecoration: 'underline',
            cursor: 'pointer',
        },
    },
    more: {
        position: 'relative',
        float: 'right',
        top: -18,
    },
    creator: {
        position: "relative",
        top: 20,
        fontSize: 12,
        fontStyle: "italic",
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        maxWidth: 100,
    },
    rating: {
        position: "relative",
        top: 20,
        fontSize: 11
    },
    status: {
        position: "relative",
        top: 23,
        left: 60,
        fontSize: 11
    },
    stars: {
        position: "relative",
        top: 23,
        fontSize: 11
    },
});


function AppStatus(props) {
    const {isPublic, isBeta, isDisabled} = props;
    if (!isPublic) {
        return <Lock style={{color: palette.blue}}/>
    }
    if (isBeta) {
        return <img src={Beta} height={16} alt="beta"/>
    }
    if (isDisabled) {
        return <Cancel style={{color: palette.red}}/>
    }
    return null;
}

class AppsCard extends Component {
  state = { dialogOpen: false };

  handleClickAppLink = (link) => {
    window.open(link, "_blank");
  };

  handleInfoDialogClose = () => {
    this.setState({dialogOpen: false});
  };

  render() {
      const {
          classes,
          uuid,
          name,
          creator,
          rating,
          type,
          link,
          description,
          isPublic,
          isBeta,
          isDisabled,
      } = this.props;

      const open = this.state.expanded;

      let avatarImgSrc = constants.GRAVATAR_URL + md5(uuid) + "?" + constants.GRAVATAR_OPTIONS;
      return (
          <React.Fragment>
              <div className={classes.card}>
                  <Card>
                      <CardContent style={{paddingLeft: 10, paddingRight: 0}}>
                          <div style={{float: "left", marginRight: 5}}>
                              <div><img src={avatarImgSrc} alt="avatar image"/></div>
                              <div className={classes.type}>
                                  {type.toLowerCase()}
                              </div>
                          </div>
                          <div>
                              <div title={name} className={classes.name}
                                   onClick={() => this.handleClickAppLink(link)}>
                                  {name}
                              </div>
                              <div className={classes.more}>
                                  <AppsMenu onInfoClick={()=> this.setState({dialogOpen: true})}/>
                              </div>
                          </div>
                          <div className={classes.creator}>
                              {creator}
                          </div>
                          <div>
                          <span className={classes.stars}>
                              <Rating
                                  placeholderRating={rating.average}
                                  emptySymbol={<img src={whitestar} className="icon" alt="white star"/>}
                                  fullSymbol={<img src={goldstar} className="icon" alt="gold star"/>}
                                  placeholderSymbol={<img src={redstar} className="icon"
                                                          alt="red star"/>}
                                  fractions={2}
                                  readonly={true}
                              />
                          </span>
                              <span className={classes.rating}>
                              ({rating.total})
                          </span>
                              <span className={classes.status}>
                                  <AppStatus isPublic={isPublic}
                                             isBeta={isBeta}
                                             isDisabled={isDisabled}/>
                              </span>
                          </div>
                      </CardContent>
                  </Card>
              </div>
              <Dialog
                  onClose={this.handleInfoDialogClose}
                  aria-labelledby="customized-dialog-title"
                  open={this.state.dialogOpen}>
                  <DialogTitle onClose={this.handleInfoDialogClose}>
                      {name}
                  </DialogTitle>
                  <DialogContent>
                      <Typography gutterBottom>
                          {description}
                      </Typography>
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={this.handleInfoDialogClose} color="primary">
                          OK
                      </Button>
                  </DialogActions>
              </Dialog>
          </React.Fragment>
      );
  }
}

AppsCard.propTypes = {
    classes: PropTypes.object.isRequired,
    uuid: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    creator: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    toolName: PropTypes.string.isRequired,
    toolVersion: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
};

export default withStyles(
  styles,
  { withTheme: true }
)(AppsCard);
