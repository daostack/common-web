import React, { FC, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useMeasure } from "react-use";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  ChatComponent,
  ChatContext,
  ChatItem,
} from "@/pages/common/components/ChatComponent";
import { CommonTab, NewCollaborationMenuItem } from "@/pages/common/constants";
import { useCommonDataContext } from "@/pages/common/providers";
import { ChatType, ViewportBreakpointVariant } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  CirclesPermissions,
  Common,
  CommonFeed,
  CommonMember,
  Governance,
} from "@/shared/models";
import { Container, MobileModal } from "@/shared/ui-kit";
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

const HEADER_HEIGHT = 221;
const BREADCRUMBS_HEIGHT = 64;

const FeedTab: FC<FeedTabProps> = (props) => {
  const { activeTab, governance, commonMember, common } = props;
  const [chatItem, setChatItem] = useState<ChatItem>();
  const userCircleIds = Object.values(commonMember?.circles.map ?? {});
  const [chatColumnRef, { width }] = useMeasure();
  const user = useSelector(selectUser());
  const isTabletView = useIsTabletView();
  const { newCollaborationMenuItem } = useCommonDataContext();
  const allowedFeedActions = !newCollaborationMenuItem
    ? [FeedAction.NewCollaboration]
    : [];

  const renderMainColumn = () => (
    <div className={styles.mainColumnWrapper}>
      {newCollaborationMenuItem === NewCollaborationMenuItem.NewDiscussion && (
        <NewDiscussionCreation
          governanceCircles={governance.circles}
          commonMember={commonMember}
        />
      )}
      <FeedItems />
    </div>
  );

  const renderAdditionalColumn = () => (
    <div ref={chatColumnRef as any} className={styles.additionalColumnWrapper}>
      <div
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT + BREADCRUMBS_HEIGHT}px)`,
          maxWidth: width,
          position: "fixed",
          top: HEADER_HEIGHT + BREADCRUMBS_HEIGHT,
        }}
      >
        {chatItem && (
          <ChatComponent
            commonMember={commonMember}
            isCommonMemberFetched
            isAuthorized={Boolean(user)}
            type={ChatType.DiscussionMessages}
            hasAccess={
              !chatItem.circleVisibility.length ||
              chatItem.circleVisibility.some((circleId) =>
                userCircleIds.includes(circleId),
              )
            }
            isHidden={false}
            common={common}
            discussionMessages={[]}
            discussion={chatItem.discussion}
            proposal={chatItem.proposal}
          />
        )}
      </div>
    </div>
  );

  const renderMobileColumn = () => (
    <div className={styles.mainColumnWrapper}>
      <FeedItems />
    </div>
  );

  const contextValue = useMemo(
    () => ({
      setChatItem,
    }),
    [setChatItem],
  );

  return (
    <ChatContext.Provider value={contextValue}>
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
      {isTabletView && (
        <MobileModal
          isShowing={Boolean(chatItem)}
          hasBackButton
          onClose={() => {
            setChatItem(undefined);
          }}
          common={common}
          title={common.description}
        >
          {chatItem && (
            <ChatComponent
              commonMember={commonMember}
              isCommonMemberFetched
              isAuthorized={Boolean(user)}
              type={ChatType.DiscussionMessages}
              hasAccess={
                !chatItem.circleVisibility.length ||
                chatItem.circleVisibility.some((circleId) =>
                  userCircleIds.includes(circleId),
                )
              }
              isHidden={false}
              common={common}
              discussionMessages={[]}
              discussion={chatItem.discussion}
              proposal={chatItem.proposal}
            />
          )}
        </MobileModal>
      )}
    </ChatContext.Provider>
  );
};

export default FeedTab;
