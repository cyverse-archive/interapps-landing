import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import LandingAppBar from '../components/LandingAppBar';
import RunningAnalysisCard from '../components/RunningAnalysisCard';
import RunningAnalysisCardGrid from '../components/RunningAnalysisCardGrid';
import NavList from '../components/NavList';
import LandingResponsiveDrawer from '../components/LandingResponsiveDrawer';
import LandingMain from '../components/LandingMain';
import { Analysis } from '../actions';
import Provider from './Provider';
import 'typeface-roboto';

storiesOf('LandingAppBar', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('default', () => (
    <LandingAppBar />
  ));

storiesOf('RunningAnalysisCard', module)
  .add('default', () => (
    <RunningAnalysisCard
      appName="App Name"
      analysisName="Analysis Name"
      description="This is a test description of a running analysis."
      analysisLink="https://cyverse.org"
      owner="Owner Name"
    />
  ))
  .add('with description longer than 140 chars', () => (
    <RunningAnalysisCard
      appName="App Name"
      analysisName="Analysis Name"
      description="This is a test description of a running analysis. Adding more characters for testing purposes. Hopefully this will have an ellipsis added to the end of it. Adding even more inconsequential text."
      analysisLink="https://cyverse.org"
      owner="Owner Name"
    />
  ))
  .add('and with an analysis name longer than 32 chars', () => (
    <RunningAnalysisCard
      appName="App Name"
      analysisName="Analysis Name12345678901234567890"
      description="This is a test description of a running analysis. Adding more characters for testing purposes. Hopefully this will have an ellipsis added to the end of it. Adding even more inconsequential text."
      analysisLink="https://cyverse.org"
      owner="Owner Name"
    />
  ))
  .add('and with an app name longer than 30 chars', () => (
    <RunningAnalysisCard
      appName="App Name123456789012345678901234567890"
      analysisName="Analysis Name12345678901234567890"
      description="This is a test description of a running analysis. Adding more characters for testing purposes. Hopefully this will have an ellipsis added to the end of it. Adding even more inconsequential text."
      analysisLink="https://cyverse.org"
      owner="Owner Name"
    />
  ))
  .add('and with an owner longer than 34 chars', () => (
    <RunningAnalysisCard
      appName="App Name123456789012345678901234567890"
      analysisName="Analysis Name12345678901234567890"
      description="This is a test description of a running analysis. Adding more characters for testing purposes. Hopefully this will have an ellipsis added to the end of it. Adding even more inconsequential text."
      analysisLink="https://cyverse.org"
      owner="Owner Name123456789012345678901234567801234567890"
    />
  ));

storiesOf('RunningAnalysisCardGrid', module)
  .add('with one card', () => {
    let analysis = new Analysis(
      '0',
      'test-analysis-name',
      'test-app-name',
      'this is a test of the running analysis card grid',
      'test-owner-name'
    );

    return (
      <RunningAnalysisCardGrid analyses={[analysis]} />
    );
  })
  .add('with two cards', () => {
    let analyses = [
      new Analysis(
        '0',
        'test-analysis-name-0',
        'test-app-name-0',
        'this is a test of the running analysis card grid 0',
        'test-owner-name 0'
      ),
      new Analysis(
        '1',
        'test-analysis-name-1',
        'test-app-name-1',
        'this is a test of the running analysis card grid 1',
        'test-owner-name 1'
      )
    ];

    return (
      <RunningAnalysisCardGrid analyses={analyses} />
    );
  })
  .add('with three cards', () => {
    let nums = [...Array(3).keys()];
    let analyses = nums.map(n => new Analysis(
      `${n}`,
      `test-analysis-name-${n}`,
      `test-app-name=${n}`,
      `this is a test of the running analysis card grid ${n}`,
      `test-owner-name ${n}`
    ));

    return (
      <RunningAnalysisCardGrid analyses={analyses} />
    );
  })
  .add('with lots of cards', () => {
    let nums = [...Array(30).keys()];
    let analyses = nums.map(n => new Analysis(
      `${n}`,
      `test-analysis-name-${n}`,
      `test-app-name=${n}`,
      `this is a test of the running analysis card grid ${n}`,
      `test-owner-name ${n}`
    ));

    return (
      <RunningAnalysisCardGrid analyses={analyses} />
    );
  });

storiesOf('NavList', module)
  .add('default', () => {
    return (
      <NavList
        handleClickFinished={() => alert("Finished clicked")}
        handleClickRunning={() => alert("Running clicked")}
        handleClickApps={() => alert("Apps clicked")}
      />
    );
  });

storiesOf('LandingResponsiveDrawer', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('default', () => {
    return (
      <LandingResponsiveDrawer
        handleClickFinished={() => alert("Finished clicked")}
        handleClickRunning={() => alert("Running clicked")}
        handleClickApps={() => alert("Apps clicked")}
      />
    );
  });

storiesOf('LandingMain', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('default', () => {
    let nums = [...Array(30).keys()];
    let analyses = nums.map(n => new Analysis(
      `${n}`,
      `test-analysis-name-${n}`,
      `test-app-name=${n}`,
      `this is a test of the running analysis card grid ${n}`,
      `test-owner-name ${n}`
    ));

    return (
      <LandingMain runningAnalyses={analyses} />
    );
  })
