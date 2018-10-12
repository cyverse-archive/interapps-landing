import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from '@material-ui/core/Button';
import LandingAppBar from '../components/LandingAppBar';
import RunningAnalysisCard from '../components/RunningAnalysisCard';

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  ));

storiesOf('LandingAppBar', module)
  .add('default', () => (
    <LandingAppBar />
  ));

storiesOf('RunningAnalysisCard', module)
  .add('default', () => (
    <RunningAnalysisCard
      appName="App Name"
      analysisName="Analysis Name"
      description="This is a test description of a running analysis."
      analysisLink=""
      owner="Owner Name"
    />
  ));
