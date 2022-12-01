import React, { FC } from "react";
import { TabPanel } from "@/shared/components";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { Common } from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { CommonTab } from "../../constants";
import { AboutTab } from "./components";

interface CommonTabPanelsProps {
  activeTab: CommonTab;
  common: Common;
}

const CommonTabPanels: FC<CommonTabPanelsProps> = (props) => {
  const { activeTab, common } = props;

  return (
    <Container
      viewports={[
        ViewportBreakpointVariant.Desktop,
        ViewportBreakpointVariant.Laptop,
      ]}
    >
      <TabPanel value={activeTab} panelValue={CommonTab.About}>
        <AboutTab common={common} />
      </TabPanel>
    </Container>
  );
};

export default CommonTabPanels;
