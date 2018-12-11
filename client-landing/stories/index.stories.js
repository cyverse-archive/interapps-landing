import React from "react";
import { storiesOf } from "@storybook/react";

import AppCardTest from "./AppCard.stories";
import AppCardGridTest from "./AppCardGrid.stories";

import AnalysisCardTest from "./AnalysisCard.stories";
import AnalysisCardGridTest from "./AnalysisCardGrid.stories";

import LandingAppBarTest from "./LandingAppBar.stories";
import LandingMainTest from "./LandingMain.stories";
import LandingResponsiveDrawerTest from "./LandingResponsiveDrawer.stories";

import NavListTest from "./NavList.stories";

storiesOf("apps/AppCard", module).add("with app", () => <AppCardTest/>);
storiesOf("apps/AppCardGrid", module).add("with app grid", () => <AppCardGridTest/>);

storiesOf("analysis/AnalysisCard", module).add("with analysis", () => <AnalysisCardTest/>);
storiesOf("analysis/AnalysisCardGrid", module).add("with analysis grid", () => <AnalysisCardGridTest/>);

storiesOf("landing/LandingAppBar", module).add("with landing Appbar", () => <LandingAppBarTest/>);
storiesOf("landing/LandingMain", module).add("with landing Main", () => <LandingMainTest/>);
storiesOf("landing/LandingResponsiveDrawer", module)
    .add("with landing Responsive drawer", () => <LandingResponsiveDrawerTest/>);

storiesOf("nav/NavList", module).add("with Nav List", () => <NavListTest/>);




