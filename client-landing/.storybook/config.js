import { addDecorator, configure } from "@storybook/react";
import { withConsole } from "@storybook/addon-console";
import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from '../src/components/App';
import React from "react";

//redirect console error / logs / warns to action logger
addDecorator((storyFn, context) => withConsole()(storyFn)(context));

//wrap with mui theme
const themeDecorator = (storyFn) => (
    <MuiThemeProvider theme={theme}>
        {storyFn()}
    </MuiThemeProvider>

);
addDecorator(themeDecorator);

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
    req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);

