import React, { FC } from "react";
import { TabPanel } from "@/shared/components";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { Common, Governance } from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { CommonTab } from "../../constants";
import { AboutTab } from "./components";

interface CommonTabPanelsProps {
  activeTab: CommonTab;
  common: Common;
  governance: Governance;
}

const CommonTabPanels: FC<CommonTabPanelsProps> = (props) => {
  const { activeTab, common, governance } = props;

  return (
    <Container
      viewports={[
        ViewportBreakpointVariant.Desktop,
        ViewportBreakpointVariant.Laptop,
      ]}
    >
      <TabPanel value={activeTab} panelValue={CommonTab.About}>
        <AboutTab common={common} rules={governance.unstructuredRules} />
      </TabPanel>
    </Container>
  );
};

export default CommonTabPanels;
