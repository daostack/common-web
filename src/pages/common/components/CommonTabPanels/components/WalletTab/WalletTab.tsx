import React, { FC } from "react";
import { WalletComponent } from "@/pages/OldCommon/components";
import { CommonTab } from "@/pages/common/constants";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { CirclesPermissions, Common } from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { TabNavigation } from "../TabNavigation";
import { WalletActions } from "./components";
import { getAllowedActions } from "./utils";
import styles from "./WalletTab.module.scss";

interface WalletTabProps {
  activeTab: CommonTab;
  common: Common;
  commonMember: CirclesPermissions | null;
}

const WalletTab: FC<WalletTabProps> = (props) => {
  const { activeTab, common, commonMember } = props;
  const allowedWalletActions = getAllowedActions(commonMember);

  return (
    <div className={styles.container}>
      <Container
        className={styles.tabNavigationContainer}
        viewports={[
          ViewportBreakpointVariant.Tablet,
          ViewportBreakpointVariant.PhoneOriented,
          ViewportBreakpointVariant.Phone,
        ]}
      >
        <TabNavigation
          activeTab={activeTab}
          rightContent={
            <WalletActions
              allowedActions={allowedWalletActions}
              commonId={common.id}
            />
          }
        />
      </Container>
      <div className={styles.columnsWrapper}>
        <div className={styles.mainColumnWrapper}>
          <WalletComponent common={common} withTabs={false} />
        </div>
      </div>
    </div>
  );
};

export default WalletTab;
