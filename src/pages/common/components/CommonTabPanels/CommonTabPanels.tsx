import React, { FC } from "react";
import { WalletComponent } from "@/pages/OldCommon/components";
import { TabPanel } from "@/shared/components";
import { ProposalsTypes, ViewportBreakpointVariant } from "@/shared/constants";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { CommonTab } from "../../constants";
import { AboutTab, FeedTab } from "./components";

interface CommonTabPanelsProps {
  activeTab: CommonTab;
  common: Common;
  governance: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
  subCommons: Common[];
}

const CommonTabPanels: FC<CommonTabPanelsProps> = (props) => {
  const { activeTab, common, governance, commonMember, subCommons } = props;

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
          governance={governance}
          commonMember={commonMember}
          rules={governance.unstructuredRules}
          subCommons={subCommons}
          limitations={
            governance.proposals[ProposalsTypes.MEMBER_ADMITTANCE]?.limitations
          }
        />
      </TabPanel>
      <TabPanel value={activeTab} panelValue={CommonTab.Feed}>
        <FeedTab
          activeTab={activeTab}
          governance={governance}
          commonMember={commonMember}
          common={common}
        />
      </TabPanel>
      <TabPanel value={activeTab} panelValue={CommonTab.Wallet}>
        <WalletComponent common={common} withTitle={false} />
      </TabPanel>
    </Container>
  );
};

export default CommonTabPanels;
