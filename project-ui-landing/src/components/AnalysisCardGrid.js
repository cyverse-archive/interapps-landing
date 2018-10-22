import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import AnalysisCard from './AnalysisCard';

class AnalysisCardGrid extends Component {
  render() {
    const { analysesIndex, analysisKeys } = this.props;

    return (
      <Grid container justify="center" spacing={16}>
        {analysisKeys.map(key => (
          <Grid item>
            <AnalysisCard
              appName={analysesIndex[key].appName}
              analysisName={analysesIndex[key].name}
              description={analysesIndex[key].description}
              analysisLink={analysesIndex[key].link}
              owner={analysesIndex[key].owner}
              startDate={analysesIndex[key].startDate}
              plannedEndDate={analysesIndex[key].plannedEndDate}
              status={analysesIndex[key].status}
            />
          </Grid>
        ))}
      </Grid>
    );
  };
}

AnalysisCardGrid.propTypes = {
  classes:       PropTypes.object.isRequired,
  analysisKeys:  PropTypes.array.isRequired,
  analysesIndex: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  analysesIndex: state.analyses.index
});

const MappedAnalysisCardGrid = connect(
  mapStateToProps
)(AnalysisCardGrid);

export default MappedAnalysisCardGrid;
