import React, { FC } from "react";
import { CommonTab, NewCollaborationMenuItem } from "@/pages/common/constants";
import { useCommonDataContext } from "@/pages/common/providers";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { TabNavigation } from "../TabNavigation";
import { FeedActions, FeedAction, NewDiscussionCreation } from "./components";
import styles from "./FeedTab.module.scss";

interface FeedTabProps {
  activeTab: CommonTab;
  governance: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
}

const FeedTab: FC<FeedTabProps> = (props) => {
  const { activeTab, governance, commonMember } = props;
  const isTabletView = useIsTabletView();
  const { common, parentCommons, newCollaborationMenuItem } =
    useCommonDataContext();
  const allowedFeedActions = [FeedAction.NewCollaboration];

  const renderMainColumn = () => (
    <div className={styles.mainColumnWrapper}>
      {newCollaborationMenuItem === NewCollaborationMenuItem.NewDiscussion && (
        <NewDiscussionCreation
          governanceCircles={governance.circles}
          commonMember={commonMember}
        />
      )}
    </div>
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
        className={styles.tabNavigationContainer}
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
          rightContent={<FeedActions allowedActions={allowedFeedActions} />}
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
