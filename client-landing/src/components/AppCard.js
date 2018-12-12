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

const styles = theme => ({
  card: {
      width: 265,
      margin: 5,
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

      let avatarImgSrc = "https://www.gravatar.com/avatar/" + uuid + "?d=identicon&s=60";
      return (
          <div className={classes.card}>
              <Card>
                  <CardContent>
                      <div style={{float: "left", marginRight: 5}}>
                          <div><img src={avatarImgSrc} alt="avatar image"/></div>
                          <div style={{
                              textAlign: 'center'
                          }}>
                              de
                          </div>
                      </div>
                      <div>
                          <div>
                          <span title={name} style={{
                              position: "relative",
                              top: -15,
                              fontSize: 12,
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              display: 'inline-block',
                              maxWidth: 100,
                          }}>
                              {name}
                          </span>
                              <span style={{position: "relative", top: -15, right: -15,}}>
                              <IconButton
                                  aria-label="More"
                                  aria-owns={open ? 'long-menu' : null}
                                  aria-haspopup="true">
                                  <MoreVertIcon/>
                              </IconButton>
                          </span>
                          </div>
                          <div style={{
                              position: "relative",
                              top: 0,
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
                          <div style={{position: "relative", top: 5}}>
                              <Rating
                                  placeholderRating={3.5}
                                  emptySymbol={<img src={whitestar} className="icon" alt="white star"/>}
                                  fullSymbol={<img src={goldstar} className="icon" alt="gold star"/>}
                                  placeholderSymbol={<img src={redstar} className="icon" alt="red star"/>}
                                  fractions={2}
                              />
                              (3)
                          </div>
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
