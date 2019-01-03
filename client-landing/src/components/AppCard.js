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
      } = this.props;

      const open = this.state.expanded;

      let avatarImgSrc = constants.GRAVATAR_URL + md5(uuid) + "?" + constants.GRAVATAR_OPTIONS;
      return (
          <div className={classes.card}>
              <Card>
                  <CardContent style={{paddingLeft: 10, paddingRight: 0}}>
                      <div style={{float: "left", marginRight: 5}}>
                          <div><img src={avatarImgSrc} alt="avatar image"/></div>
                          <div style={{
                              textAlign: 'center'
                          }}>
                              de
                          </div>
                      </div>
                      <div>
                          <div title={name} style={{
                              position: "relative",
                              top: -5,
                              fontSize: 12,
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              display: 'inline-block',
                              maxWidth: 100,
                          }}>
                              {name}
                          </div>
                           <div style={{position: 'relative', float: 'right', top: -18,}}>
                              <IconButton
                                  aria-label="More"
                                  aria-owns={open ? 'long-menu' : null}
                                  aria-haspopup="true">
                                  <MoreVertIcon/>
                              </IconButton>
                          </div>
                      </div>
                      <div style={{
                          position: "relative",
                          top: 20,
                          fontSize: 12,
                          fontStyle: "italic",
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          display: 'inline-block',
                          maxWidth: 100,
                      }}>
                          {creator}
                      </div>
                      <div style={{position: "relative", top: 25}}>
                          <Rating
                              placeholderRating={3.5}
                              emptySymbol={<img src={whitestar} className="icon" alt="white star"/>}
                              fullSymbol={<img src={goldstar} className="icon" alt="gold star"/>}
                              placeholderSymbol={<img src={redstar} className="icon" alt="red star"/>}
                              fractions={2}
                          />
                          (3)
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
