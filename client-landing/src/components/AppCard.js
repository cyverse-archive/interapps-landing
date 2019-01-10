import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import goldstar from "../../src/images/star-gold.gif";
import whitestar from "../../src/images/star-white.gif";
import redstar from "../../src/images/star-red.gif";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Rating from "react-rating";
import IconButton from "@material-ui/core/IconButton";
import md5 from "md5";
import constants from '../constants';

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
    stars: {
        position: "relative",
        top: 23,
        fontSize: 11
    },
});

class AppCard extends Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleClickAppLink = () => {
    window.open(this.props.link);
  };

  render() {
      const {
          classes,
          uuid,
          name,
          creator,
          rating,
          type
      } = this.props;

      const open = this.state.expanded;

      let avatarImgSrc = constants.GRAVATAR_URL + md5(uuid) + "?" + constants.GRAVATAR_OPTIONS;
      return (
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
                          <div title={name} className={classes.name}>
                              {name}
                          </div>
                          <div className={classes.more}>
                              <IconButton
                                  aria-label="More"
                                  aria-owns={open ? 'long-menu' : null}
                                  aria-haspopup="true">
                                  <MoreVertIcon/>
                              </IconButton>
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
                              />
                          </span>
                          <span className={classes.rating}>
                              ({rating.total})
                          </span>
                      </div>
                  </CardContent>
              </Card>
          </div>
      );
  }
}

AppCard.propTypes = {
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
)(AppCard);
