import React, { FC, LegacyRef, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useMeasure } from "react-use";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ChatMobileModal } from "@/pages/common/components";
import {
  ChatComponent,
  ChatContext,
  ChatItem,
} from "@/pages/common/components/ChatComponent";
import { CommonTab } from "@/pages/common/constants";
import {
  CommonAction,
  ViewportBreakpointVariant,
  Colors,
  ChatType,
} from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { isRTL } from "@/shared/utils";
import { selectCommonAction } from "@/store/states";
import { TabNavigation } from "../TabNavigation";
import {
  FeedActions,
  FeedAction,
  FeedItems,
  NewDiscussionCreation,
  NewProposalCreation,
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
const DISCUSSION_TITLE_PADDING_HEIGHT = 41;

export const FeedTab: FC<FeedTabProps> = (props) => {
  const { activeTab, governance, commonMember, common } = props;
  const [chatItem, setChatItem] = useState<ChatItem | null>();
  const userCircleIds = useMemo(
    () => Object.values(commonMember?.circles.map ?? {}),
    [commonMember],
  );
  const [chatColumnRef, { width: chatWidth }] = useMeasure();
  const [chatTitleRef, { height: chatTitleHeight }] = useMeasure();
  const user = useSelector(selectUser());
  const isTabletView = useIsTabletView();
  const commonAction = useSelector(selectCommonAction);
  const allowedFeedActions = !commonAction ? [FeedAction.NewCollaboration] : [];

  const hasAccessToChat = useMemo(() => {
    if (!chatItem) {
      return false;
    }

    return (
      !chatItem.circleVisibility.length ||
      chatItem.circleVisibility.some((circleId) =>
        userCircleIds.includes(circleId),
      )
    );
  }, [chatItem, userCircleIds]);

  const renderMainColumn = () => (
    <div className={styles.mainColumnWrapper}>
      {commonAction === CommonAction.NewDiscussion && (
        <NewDiscussionCreation
          governanceCircles={governance.circles}
          commonMember={commonMember}
          isModalVariant={false}
        />
      )}
      {commonAction === CommonAction.NewProposal && (
        <NewProposalCreation
          governanceCircles={governance.circles}
          commonMember={commonMember}
          isModalVariant={false}
        />
      )}
      <FeedItems userCircleIds={userCircleIds} />
    </div>
  );

  const chatWrapperStyle = useMemo(
    () => ({
      ...(chatItem && { border: `0.0625rem solid ${Colors.neutrals300}` }),
      maxWidth: chatWidth,
      marginBottom: "0.5rem",
      top: HEADER_HEIGHT + BREADCRUMBS_HEIGHT,
    }),
    [chatWidth, chatItem],
  );

  const renderAdditionalColumn = () => (
    <div
      ref={chatColumnRef as LegacyRef<HTMLDivElement>}
      className={styles.additionalColumnWrapper}
    >
      <div className={styles.chatWrapper} style={chatWrapperStyle}>
        {chatItem && (
          <>
            <p
              className={classNames(styles.chatDiscussionTitle, {
                [styles.chatDiscussionTitleRTL]: isRTL(
                  chatItem.discussion.title,
                ),
              })}
              ref={chatTitleRef as LegacyRef<HTMLParagraphElement>}
            >
              {chatItem.discussion.title}
            </p>
            <ChatComponent
              commonMember={commonMember}
              isCommonMemberFetched
              isAuthorized={Boolean(user)}
              type={
                chatItem.proposal
                  ? ChatType.ProposalComments
                  : ChatType.DiscussionMessages
              }
              hasAccess={hasAccessToChat}
              isHidden={false}
              common={common}
              discussion={chatItem.discussion}
              proposal={chatItem.proposal}
              feedItemId={chatItem.feedItemId}
              titleHeight={
                chatTitleHeight
                  ? chatTitleHeight + DISCUSSION_TITLE_PADDING_HEIGHT
                  : 0
              }
              lastSeenItem={chatItem.lastSeenItem}
            />
          </>
        )}
      </div>
    </div>
  );

  const renderMobileColumn = () => (
    <div className={styles.mainColumnWrapper}>
      {commonAction === CommonAction.NewDiscussion && (
        <NewDiscussionCreation
          governanceCircles={governance.circles}
          commonMember={commonMember}
          commonImage={common.image}
          commonName={common.name}
          isModalVariant
        />
      )}
      {commonAction === CommonAction.NewProposal && (
        <NewProposalCreation
          governanceCircles={governance.circles}
          commonMember={commonMember}
          commonImage={common.image}
          commonName={common.name}
          isModalVariant
        />
      )}
      <FeedItems userCircleIds={userCircleIds} />
      <ChatMobileModal
        isShowing={Boolean(chatItem)}
        hasBackButton
        onClose={() => {
          setChatItem(null);
        }}
        common={common}
        title={chatItem?.discussion.title}
      >
        {chatItem && (
          <ChatComponent
            commonMember={commonMember}
            isCommonMemberFetched
            isAuthorized={Boolean(user)}
            type={ChatType.DiscussionMessages}
            hasAccess={hasAccessToChat}
            isHidden={false}
            common={common}
            discussion={chatItem.discussion}
            proposal={chatItem.proposal}
            feedItemId={chatItem.feedItemId}
            lastSeenItem={chatItem.lastSeenItem}
          />
        )}
      </ChatMobileModal>
    </div>
  );

  const contextValue = useMemo(
    () => ({
      setChatItem,
      activeItemDiscussionId: chatItem?.discussion.id,
    }),
    [setChatItem, chatItem?.discussion.id],
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
    </ChatContext.Provider>
  );
};
