import React, { FC } from "react";
import classNames from "classnames";
import { CommonTab } from "@/pages/common/constants";
import { useCommonDataContext } from "@/pages/common/providers";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Container } from "@/shared/ui-kit";
import { TabNavigation } from "../TabNavigation";
import styles from "./FeedTab.module.scss";

interface FeedTabProps {
  activeTab: CommonTab;
}

const FeedTab: FC<FeedTabProps> = (props) => {
  const { activeTab } = props;
  const isTabletView = useIsTabletView();
  const { common, parentCommons } = useCommonDataContext();

  const renderMainColumn = () => (
    <div className={styles.mainColumnWrapper}></div>
  );

  const renderAdditionalColumn = () => (
    <div className={styles.additionalColumnWrapper}></div>
  );

  const renderMobileColumn = () => (
    <div className={styles.mainColumnWrapper}></div>
  );

  return (
    <div className={styles.container}>
      <Container
        className={classNames(
          styles.tabNavigationContainer,
          styles.tabNavigationContainerWithoutActions,
        )}
        viewports={[
          ViewportBreakpointVariant.Tablet,
          ViewportBreakpointVariant.PhoneOriented,
          ViewportBreakpointVariant.Phone,
        ]}
      >
        <TabNavigation
          activeTab={activeTab}
          common={common}
          parentCommons={parentCommons}
        />
      </Container>
      <div className={styles.columnsWrapper}>
        {!isTabletView ? (
          <>
            {renderMainColumn()}
            {renderAdditionalColumn()}
          </>
        ) : (
          renderMobileColumn()
        )}
      </div>
    </div>
  );
};

export default FeedTab;
