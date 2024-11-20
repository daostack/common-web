import React, { FC, LegacyRef, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { useCommonDataContext } from "@/pages/common/providers";
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
import { commonActions } from "@/store/states";
import { FeedItems } from "../../../FeedItems";
import { TabNavigation } from "../TabNavigation";
import {
  FeedActions,
  FeedAction,
  NewDiscussionCreation,
  NewProposalCreation,
} from "./components";
import { checkHasAccessToChat } from "./utils";
import styles from "./FeedTab.module.scss";

interface FeedTabProps {
  activeTab: CommonTab;
  governance: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
  common: Common;
}

const HEADER_HEIGHT = 221;
const BREADCRUMBS_HEIGHT = 64;

export const FeedTab: FC<FeedTabProps> = (props) => {
  const { activeTab, governance, commonMember, common } = props;
  const dispatch = useDispatch();
  const { parentCommons, subCommons } = useCommonDataContext();
  const [chatItem, setChatItem] = useState<ChatItem | null>();
  const userCircleIds = useMemo(
    () => Object.values(commonMember?.circles.map ?? {}),
    [commonMember],
  );
  const [chatColumnRef, { width: chatWidth }] = useMeasure();
  const user = useSelector(selectUser());
  const isTabletView = useIsTabletView();
  const commonAction = useSelector(selectCommonAction(common.id));
  const allowedFeedActions = !commonAction ? [FeedAction.NewStream] : [];

  const hasAccessToChat = useMemo(
    () => checkHasAccessToChat(userCircleIds, chatItem),
    [chatItem, userCircleIds],
  );

  const renderMainColumn = () => (
    <div className={styles.mainColumnWrapper}>
      {commonAction === CommonAction.NewDiscussion && (
        <NewDiscussionCreation
          common={common}
          governanceCircles={governance.circles}
          commonMember={commonMember}
          isModalVariant={false}
        />
      )}
      {commonAction === CommonAction.NewProposal && (
        <NewProposalCreation
          common={common}
          governance={governance}
          parentCommons={parentCommons}
          subCommons={subCommons}
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
                  chatItem.discussion?.title,
                ),
              })}
            >
              {chatItem.discussion?.title}
            </p>
            <ChatComponent
              governanceCircles={governance.circles}
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
              commonId={common.id}
              discussion={chatItem.discussion}
              feedItemId={chatItem.feedItemId}
              lastSeenItem={chatItem.lastSeenItem}
              directParent={common.directParent}
            />
          </>
        )}
      </div>
    </div>
  );

  const renderMobileColumn = () => (
    <div className={styles.mainColumnWrapper}>
      <FeedItems userCircleIds={userCircleIds} />
      <ChatMobileModal
        isShowing={Boolean(chatItem)}
        hasBackButton
        onClose={() => {
          setChatItem(null);
        }}
        commonName={common.name}
        commonImage={common.image}
        title={chatItem?.discussion?.title}
      >
        {chatItem && (
          <ChatComponent
            governanceCircles={governance.circles}
            commonMember={commonMember}
            isCommonMemberFetched
            isAuthorized={Boolean(user)}
            type={ChatType.DiscussionMessages}
            hasAccess={hasAccessToChat}
            isHidden={false}
            commonId={common.id}
            discussion={chatItem.discussion}
            feedItemId={chatItem.feedItemId}
            lastSeenItem={chatItem.lastSeenItem}
            directParent={common.directParent}
          />
        )}
      </ChatMobileModal>
    </div>
  );

  useEffect(() => {
    return () => {
      dispatch(commonActions.getFeedItems.cancel({ commonId: common.id }));
      dispatch(commonActions.resetFeedItems({ commonId: common.id }));
    };
  }, [common.id]);

  const contextValue = useMemo(
    () => ({
      setChatItem,
      activeItemDiscussionId: chatItem?.discussion?.id,
    }),
    [setChatItem, chatItem?.discussion?.id],
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
