import React, { FC } from "react";
import { WalletComponent } from "@/pages/OldCommon/components";
import { CommonTab } from "@/pages/common/constants";
import { useCommonDataContext } from "@/pages/common/providers";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { Common } from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { TabNavigation } from "../TabNavigation";
import { WalletActions } from "./components";
import { getAllowedActions } from "./utils";
import styles from "./WalletTab.module.scss";

interface WalletTabProps {
  activeTab: CommonTab;
  common: Common;
}

const WalletTab: FC<WalletTabProps> = (props) => {
  const { activeTab, common } = props;
  const { supportersData } = useCommonDataContext();
  const allowedWalletActions = getAllowedActions(supportersData);

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
