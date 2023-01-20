import React, { FC } from "react";
import { useSelector } from "react-redux";
import { CommonTab } from "@/pages/common/constants";
import { CommonAction, ViewportBreakpointVariant } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { selectCommonAction } from "@/store/states";
import { TabNavigation } from "../TabNavigation";
import {
  FeedActions,
  FeedAction,
  FeedItems,
  NewDiscussionCreation,
} from "./components";
import styles from "./FeedTab.module.scss";

interface FeedTabProps {
  activeTab: CommonTab;
  governance: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
  common: Common;
}

export const FeedTab: FC<FeedTabProps> = (props) => {
  const { activeTab, governance, commonMember } = props;
  const isTabletView = useIsTabletView();
  const commonAction = useSelector(selectCommonAction);
  const allowedFeedActions = !commonAction ? [FeedAction.NewCollaboration] : [];

  const renderMainColumn = () => (
    <div className={styles.mainColumnWrapper}>
      {commonAction === CommonAction.NewDiscussion && (
        <NewDiscussionCreation
          governanceCircles={governance.circles}
          commonMember={commonMember}
        />
      )}
      <FeedItems />
    </div>
  );

  const renderAdditionalColumn = () => (
    <div className={styles.additionalColumnWrapper}></div>
  );

  const renderMobileColumn = () => (
    <div className={styles.mainColumnWrapper}>
      <FeedItems />
    </div>
  );

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
            <FeedActions
              allowedActions={allowedFeedActions}
              commonMember={commonMember}
              governance={governance}
            />
          }
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
