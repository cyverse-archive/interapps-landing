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

let bigDescription = `feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget egestas purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae auctor eu augue ut lectus arcu bibendum at varius vel pharetra vel turpis nunc eget lorem dolor sed viverra ipsum nunc aliquet bibendum enim facilisis gravida neque convallis a cras semper auctor neque vitae tempus quam pellentesque nec nam aliquam sem et tortor consequat id porta nibh venenatis cras sed felis eget velit aliquet sagittis id consectetur purus ut faucibus pulvinar elementum integer enim neque volutpat ac tincidunt vitae semper quis lectus nulla at volutpat.`

let start = Date.now();
let end = start + (86400000 * 2);
let startDate = new Date(start);
let endDate = new Date(end);

storiesOf('RunningAnalysisCard', module)
  .add('default', () => {
    return (
      <RunningAnalysisCard
        appName="App Name"
        analysisName="Analysis Name"
        description="This is a test description of a running analysis."
        analysisLink="http://localhost"
        startDate={startDate.toLocaleString()}
        plannedEndDate={endDate.toLocaleString()}
        owner="Owner Name"
      />
    );
  })
  .add('with description longer than 280 chars', () => (
    <RunningAnalysisCard
      appName="App Name"
      analysisName="Analysis Name"
      description={bigDescription}
      analysisLink="http://localhost"
      startDate={startDate.toLocaleString()}
      plannedEndDate={endDate.toLocaleString()}
      owner="Owner Name"
    />
  ))
  .add('and with an analysis name longer than 32 chars', () => (
    <RunningAnalysisCard
      appName="App Name"
      analysisName="Analysis Name12345678901234567890"
      analysisLink="http://localhost"
      description={bigDescription}
      startDate={startDate.toLocaleString()}
      plannedEndDate={endDate.toLocaleString()}
      owner="Owner Name"
    />
  ))
  .add('and with an app name longer than 30 chars', () => (
    <RunningAnalysisCard
      appName="App Name123456789012345678901234567890"
      analysisName="Analysis Name12345678901234567890"
      analysisLink="http://localhost"
      description={bigDescription}
      startDate={startDate.toLocaleString()}
      plannedEndDate={endDate.toLocaleString()}
      owner="Owner Name"
    />
  ))
  .add('and with an owner longer than 34 chars', () => (
    <RunningAnalysisCard
      appName="App Name123456789012345678901234567890"
      analysisName="Analysis Name12345678901234567890"
      analysisLink="http://localhost"
      description={bigDescription}
      analysisLink="https://cyverse.org"
      startDate={startDate.toLocaleString()}
      plannedEndDate={endDate.toLocaleString()}
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
      'test-owner-name',
      startDate.toLocaleString(),
      endDate.toLocaleString(),
      "http://localhost"
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
        'test-owner-name 0',
        startDate.toLocaleString(),
        endDate.toLocaleString(),
        "http://localhost"
      ),
      new Analysis(
        '1',
        'test-analysis-name-1',
        'test-app-name-1',
        'this is a test of the running analysis card grid 1',
        'test-owner-name 1',
        startDate.toLocaleString(),
        endDate.toLocaleString(),
        "http://localhost"
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
      `test-owner-name ${n}`,
      startDate.toLocaleString(),
      endDate.toLocaleString(),
      "http://localhost"
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
      `test-owner-name ${n}`,
      startDate.toLocaleString(),
      endDate.toLocaleString(),
      "http://localhost"
    ));

    return (
      <RunningAnalysisCardGrid analyses={analyses} />
    );
  });

storiesOf('NavList', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('default', () => {
    return (
      <NavList />
    );
  });

storiesOf('LandingResponsiveDrawer', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('default', () => {
    return (
      <LandingResponsiveDrawer />
    );
  });

storiesOf('LandingMain', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('one analysis', () => {
    let analysis = new Analysis(
      "0",
      "test-analysis-name",
      "test-app-name",
      "this is a test of the running analysis card grid",
      "test-owner-name",
      startDate.toLocaleString(),
      endDate.toLocaleString(),
      "http://localhost"
    );

    return (
      <LandingMain runningAnalyses={[analysis]} />
    );
  })
  .add('lots of analyses', () => {
    let nums = [...Array(30).keys()];
    let analyses = nums.map(n => new Analysis(
      `${n}`,
      `test-analysis-name-${n}`,
      `test-app-name=${n}`,
      `this is a test of the running analysis card grid ${n}`,
      `test-owner-name ${n}`,
      startDate.toLocaleString(),
      endDate.toLocaleString(),
      "http://localhost"
    ));

    return (
      <LandingMain runningAnalyses={analyses} />
    );
  })
