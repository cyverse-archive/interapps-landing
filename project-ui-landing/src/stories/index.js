import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from '@material-ui/core/Button';
import LandingAppBar from '../components/LandingAppBar';
import RunningAnalysisCard from '../components/RunningAnalysisCard';
import 'typeface-roboto';

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
  ));
