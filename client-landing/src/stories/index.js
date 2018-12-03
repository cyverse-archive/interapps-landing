import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import LandingAppBar from '../components/LandingAppBar';
import AppCard from '../components/AppCard';
import AppCardGrid from '../components/AppCardGrid';
import AnalysisCard from '../components/AnalysisCard';
import AnalysisCardGrid from '../components/AnalysisCardGrid';
import NavList from '../components/NavList';
import LandingResponsiveDrawer from '../components/LandingResponsiveDrawer';
import LandingMain from '../components/LandingMain';
import { Analysis, App } from '../actions';
import { Provider } from 'react-redux';
import { newStore } from '../store/configure';
import { toggleMobileOpen, setPageToShow, addApp, addAnalysis } from '../actions';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { theme } from '../components/App';
import 'typeface-roboto';

const Wrapper = ({store, theme, children}) => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  </Provider>
);

storiesOf('LandingAppBar', module)
  .addDecorator(getStory => {
    const store = newStore();
    return (
      <Wrapper store={store} theme={theme}>
        {getStory()}
      </Wrapper>
    );
  })
  .add('default', () => {
    return (
      <LandingAppBar />
    );
  });

let bigDescription = `feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget egestas purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae auctor eu augue ut lectus arcu bibendum at varius vel pharetra vel turpis nunc eget lorem dolor sed viverra ipsum nunc aliquet bibendum enim facilisis gravida neque convallis a cras semper auctor neque vitae tempus quam pellentesque nec nam aliquam sem et tortor consequat id porta nibh venenatis cras sed felis eget velit aliquet sagittis id consectetur purus ut faucibus pulvinar elementum integer enim neque volutpat ac tincidunt vitae semper quis lectus nulla at volutpat.`

let start = Date.now();
let end = start + (86400000 * 2);
let startDate = new Date(start);
let endDate = new Date(end);

storiesOf('AnalysisCard', module)
  .add('default', () => {
    return (
      <AnalysisCard
        appName="App Name"
        analysisName="Analysis Name"
        description="This is a test description of a running analysis."
        analysisLink="http://localhost"
        startDate={startDate.toLocaleString()}
        plannedEndDate={endDate.toLocaleString()}
        owner="Owner Name"
        status="Running"
      />
    );
  })
  .add('with description longer than 280 chars', () => (
    <AnalysisCard
      appName="App Name"
      analysisName="Analysis Name"
      description={bigDescription}
      analysisLink="http://localhost"
      startDate={startDate.toLocaleString()}
      plannedEndDate={endDate.toLocaleString()}
      owner="Owner Name"
      status="Running"
    />
  ))
  .add('and with an analysis name longer than 32 chars', () => (
    <AnalysisCard
      appName="App Name"
      analysisName="Analysis Name12345678901234567890"
      analysisLink="http://localhost"
      description={bigDescription}
      startDate={startDate.toLocaleString()}
      plannedEndDate={endDate.toLocaleString()}
      owner="Owner Name"
      status="Running"
    />
  ))
  .add('and with an app name longer than 30 chars', () => (
    <AnalysisCard
      appName="App Name123456789012345678901234567890"
      analysisName="Analysis Name12345678901234567890"
      analysisLink="http://localhost"
      description={bigDescription}
      startDate={startDate.toLocaleString()}
      plannedEndDate={endDate.toLocaleString()}
      owner="Owner Name"
      status="Running"
    />
  ))
  .add('and with an owner longer than 34 chars', () => (
    <AnalysisCard
      appName="App Name123456789012345678901234567890"
      analysisName="Analysis Name12345678901234567890"
      analysisLink="http://localhost"
      description={bigDescription}
      analysisLink="https://cyverse.org"
      startDate={startDate.toLocaleString()}
      plannedEndDate={endDate.toLocaleString()}
      owner="Owner Name123456789012345678901234567801234567890"
      status="Running"
    />
  ));

storiesOf('AppCard', module)
  .add('default', () => (
    <AppCard
      appName="App Name"
      creator="Creator Name"
      appLink="http://localhost"
      description="Test description for an app card."
      toolName="Tool Name"
      toolVersion="0.0.1"
    />
  ))

storiesOf('AnalysisCardGrid', module)
  .addDecorator(getStory => {
    const store = newStore();
    let nums = [...Array(3).keys()];
    let analyses = nums.map(n => new Analysis(
      `${n}`,
      `test-analysis-name-${n}`,
      `test-app-name=${n}`,
      `this is a test of the running analysis card grid ${n}`,
      `test-owner-name ${n}`,
      startDate.toLocaleString(),
      endDate.toLocaleString(),
      "http://localhost",
      "Running"
    )).forEach(a => store.dispatch(addAnalysis(a)));

    return (
      <Wrapper store={store} theme={theme}>
        {getStory()}
      </Wrapper>
    );
  })
  .add('with three cards', () => {
    return (
      <AnalysisCardGrid analysisKeys={[...Array(3).keys()]} />
    );
  });

  storiesOf('AppCardGrid', module)
    .addDecorator(getStory => {
      const store = newStore();
      let nums = [...Array(3).keys()];
      let analyses = nums.map(n => new App(
        `${n}`,
        `test-app-name-${n}`,
        `test-tool-name=${n}`,
        `0.0.${n}`,
        `this is a test of the app card grid ${n}`,
        `test-creator-name ${n}`,
        "http://localhost"
      )).forEach(a => store.dispatch(addApp(a)));

      return (
        <Wrapper store={store} theme={theme}>
          {getStory()}
        </Wrapper>
      );
    })
    .add('with three cards', () => {
      return (
        <AppCardGrid appKeys={[...Array(3).keys()]} />
      );
    });

storiesOf('NavList', module)
  .addDecorator(getStory => {
    const store = newStore();

    return (
      <Wrapper store={store} theme={theme}>
        {getStory()}
      </Wrapper>
    );
  })
  .add('default', () => {
    return (
      <NavList />
    );
  });

storiesOf('LandingResponsiveDrawer', module)
  .addDecorator(getStory => {
    const store = newStore();

    return (
      <Wrapper store={store} theme={theme}>
        {getStory()}
      </Wrapper>
    );
  })
  .add('default', () => {
    return (
      <LandingResponsiveDrawer />
    );
  });

storiesOf('LandingMain', module)
  .addDecorator(getStory => {
    const store = newStore();

    let nums = [...Array(30).keys()];

    let running = nums.map(n => new Analysis(
      `${n}`,
      `test-analysis-name-${n}`,
      `test-app-name=${n}`,
      `this is a test of the running analysis card grid ${n}`,
      `test-owner-name ${n}`,
      startDate.toLocaleString(),
      endDate.toLocaleString(),
      "http://localhost",
      "Running"
    ));

    let failed = nums.map(n => new Analysis(
      `${30+n}`,
      `test-analysis-name-${30+n}`,
      `test-app-name=${30+n}`,
      `this is a test of the running analysis card grid ${30+n}`,
      `test-owner-name ${30+n}`,
      startDate.toLocaleString(),
      endDate.toLocaleString(),
      "http://localhost",
      "Failed"
    ));

    let completed = nums.map(n => new Analysis(
      `${60+n}`,
      `test-analysis-name-${60+n}`,
      `test-app-name=${60+n}`,
      `this is a test of the running analysis card grid ${60+n}`,
      `test-owner-name ${60+n}`,
      startDate.toLocaleString(),
      endDate.toLocaleString(),
      "http://localhost",
      "Completed"
    ));

    [...running, ...failed, ...completed].forEach(a => store.dispatch(addAnalysis(a)));

    let appnums = [...Array(30).keys()];
    let apps = appnums.map(n => new App(
      `${n}`,
      `test-app-name-${n}`,
      `test-tool-name=${n}`,
      `0.0.${n}`,
      `this is a test of the app card grid ${n}`,
      `test-creator-name ${n}`,
      "http://localhost"
    )).forEach(a => store.dispatch(addApp(a)));

    return (
      <Wrapper store={store} theme={theme}>
        {getStory()}
      </Wrapper>
    );
  })
  .add('lots of analyses', () => {
    return (
      <LandingMain />
    );
  })
