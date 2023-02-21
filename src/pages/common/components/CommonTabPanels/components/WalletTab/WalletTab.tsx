import React, { FC } from "react";
import { WalletComponent } from "@/pages/OldCommon/components";
import { CommonTab } from "@/pages/common/constants";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { Common } from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { TabNavigation } from "../TabNavigation";
import styles from "./WalletTab.module.scss";

interface WalletTabProps {
  activeTab: CommonTab;
  common: Common;
}

const WalletTab: FC<WalletTabProps> = (props) => {
  const { activeTab, common } = props;

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
        <TabNavigation activeTab={activeTab} />
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
