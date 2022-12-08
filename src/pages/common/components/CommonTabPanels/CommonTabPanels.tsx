import React, { FC } from "react";
import { TabPanel } from "@/shared/components";
import { ProposalsTypes, ViewportBreakpointVariant } from "@/shared/constants";
import { Common, Governance } from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { CommonTab } from "../../constants";
import { AboutTab } from "./components";

interface CommonTabPanelsProps {
  activeTab: CommonTab;
  common: Common;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
}

const CommonTabPanels: FC<CommonTabPanelsProps> = (props) => {
  const { activeTab, common, governance, parentCommons, subCommons } = props;

  return (
    <Container
      viewports={[
        ViewportBreakpointVariant.Desktop,
        ViewportBreakpointVariant.Laptop,
      ]}
    >
      <TabPanel value={activeTab} panelValue={CommonTab.About}>
        <AboutTab
          activeTab={activeTab}
          common={common}
          rules={governance.unstructuredRules}
          parentCommons={parentCommons}
          subCommons={subCommons}
          limitations={
            governance.proposals[ProposalsTypes.MEMBER_ADMITTANCE]?.limitations
          }
        />
      </TabPanel>
    </Container>
  );
};

export default CommonTabPanels;
