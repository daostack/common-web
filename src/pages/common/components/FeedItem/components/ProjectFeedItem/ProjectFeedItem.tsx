import React, {
  CSSProperties,
  FC,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCollapse } from "react-collapsed";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { useFeedItemContext } from "@/pages/common";
import { ButtonIcon } from "@/shared/components";
import { useRoutesContext } from "@/shared/contexts";
import { useCommon, useFeedItemFollow } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { OpenIcon, SmallArrowIcon } from "@/shared/icons";
import { SpaceListVisibility } from "@/shared/interfaces";
import { CommonFeed } from "@/shared/models";
import {
  CommonAvatar,
  Loader,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit";
import { checkIsProject, emptyFunction } from "@/shared/utils";
import { CommonCard } from "../../../CommonCard";
import { COLLAPSE_DURATION } from "../../../FeedCard/constants";
import { FeedItem } from "../../../FeedItem";
import { useFeedItemCounters } from "../../hooks";
import { useFeedItems } from "./hooks";
import styles from "./ProjectFeedItem.module.scss";

interface ProjectFeedItemProps {
  item: CommonFeed;
  isMobileVersion: boolean;
  level?: number;
}

export const ProjectFeedItem: FC<ProjectFeedItemProps> = (props) => {
  const { item, isMobileVersion, level = 1 } = props;
  const isTabletView = useIsTabletView();
  const containerRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const { getCommonPagePath } = useRoutesContext();
  const { renderFeedItemBaseContent, feedCardSettings } = useFeedItemContext();
  const { data: common, fetched: isCommonFetched, fetchCommon } = useCommon();
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember();
  const feedItemFollow = useFeedItemFollow(
    { feedItemId: item.id, commonId: item.data.id },
    { withSubscription: true },
  );
  const {
    projectUnreadStreamsCount: unreadStreamsCount,
    projectUnreadMessages: unreadMessages,
  } = useFeedItemCounters(item.id, common?.directParent?.commonId);
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const commonId = item.data.id;
  const {
    data: feedItems,
    fetched,
    fetchFeedItems,
  } = useFeedItems(commonId, userId);
  const [isExpanded, setIsExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded,
    duration: COLLAPSE_DURATION,
  });
  const isLoading = !fetched;
  const expandedFeedItemId = "";
  const lastMessage = parseStringToTextEditorValue(
    `${unreadStreamsCount ?? 0} unread stream${
      unreadStreamsCount === 1 ? "" : "s"
    }`,
  );
  const isProject = checkIsProject(common);
  const userCircleIds = useMemo(
    () => Object.values(commonMember?.circles.map ?? {}),
    [commonMember?.circles.map],
  );
  const titleEl = (
    <>
      <span className={styles.title}>{common?.name}</span>
      <OpenIcon className={styles.openIcon} />
    </>
  );

  const handleClick = () => {
    history.push(getCommonPagePath(commonId));
  };

  const handleExpand: MouseEventHandler = (event) => {
    event.stopPropagation();
    setIsExpanded((v) => !v);
  };

  const renderLeftContent = (): ReactNode => (
    <div className={styles.leftContent}>
      <ButtonIcon
        className={styles.arrowIconButton}
        onClick={handleExpand}
        aria-label={`${isExpanded ? "Hide" : "Show"} ${common?.name}'s spaces`}
      >
        <SmallArrowIcon
          className={classNames(styles.arrowIcon, {
            [styles.arrowIconOpen]: isExpanded,
          })}
        />
      </ButtonIcon>
      <CommonAvatar
        className={classNames(styles.image, {
          [styles.imageNonRounded]: !isProject,
          [styles.imageRounded]: isProject,
        })}
        src={common?.image}
        alt={`${common?.name}'s image`}
        name={common?.name}
      />
    </div>
  );

  useEffect(() => {
    fetchCommonMember(commonId);
    fetchCommon(commonId);
  }, [commonId]);

  useEffect(() => {
    if (isExpanded) {
      fetchFeedItems();
    }
  }, [isExpanded]);

  if (
    !isCommonMemberFetched ||
    (!commonMember && common?.listVisibility === SpaceListVisibility.Members)
  ) {
    return null;
  }

  const renderContent = (): ReactNode => {
    if (feedItems.length === 0) {
      return null;
    }

    return (
      <div className={styles.feedItemsContainer}>
        {feedItems.map((item) => {
          const isActive = false;
          const isPinned = (common?.pinnedFeedItems || []).some(
            (pinnedItem) => pinnedItem.feedObjectId === item.feedItem.id,
          );

          return (
            <FeedItem
              key={item.feedItem.id}
              commonMember={commonMember}
              commonId={common?.id}
              commonName={common?.name || ""}
              commonImage={common?.image || ""}
              commonNotion={common?.notion}
              pinnedFeedItems={common?.pinnedFeedItems}
              isProject={isProject}
              isPinned={isPinned}
              item={item.feedItem}
              isMobileVersion={isTabletView}
              userCircleIds={userCircleIds}
              isActive={isActive}
              isExpanded={item.feedItem.id === expandedFeedItemId}
              currentUserId={userId}
              shouldCheckItemVisibility={
                !item.feedItemFollowWithMetadata ||
                item.feedItemFollowWithMetadata.userId !== userId
              }
              directParent={common?.directParent}
              rootCommonId={common?.rootCommonId}
              level={level + 1}
              withoutMenu
              onFeedItemClick={emptyFunction}
              onInternalLinkClick={emptyFunction}
            />
          );
        })}
      </div>
    );
  };

  const itemStyles = {
    "--project-feed-item-level": level,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className={styles.collapseContainer}
      style={itemStyles}
    >
      <div {...getToggleProps()}>
        {renderFeedItemBaseContent?.({
          className: styles.container,
          titleWrapperClassName: styles.titleWrapper,
          lastActivity: item.updatedAt.seconds * 1000,
          isMobileView: isMobileVersion,
          title: titleEl,
          onClick: handleClick,
          onExpand: handleExpand,
          seenOnce: true,
          isLoading: !isCommonFetched,
          unreadMessages,
          lastMessage,
          seen: !(
            unreadStreamsCount &&
            unreadStreamsCount > 0 &&
            unreadMessages === 0
          ),
          renderLeftContent,
          shouldHideBottomContent: !lastMessage,
          isFollowing: feedItemFollow.isFollowing,
          notion: common?.notion,
        })}
      </div>
      <div {...getCollapseProps()}>
        <CommonCard
          className={classNames(
            styles.commonCard,
            {
              [styles.commonCardActive]: isExpanded,
            },
            feedCardSettings?.commonCardClassName,
          )}
          hideCardStyles={feedCardSettings?.shouldHideCardStyles ?? true}
        >
          {isLoading ? <Loader className={styles.loader} /> : renderContent()}
        </CommonCard>
      </div>
    </div>
  );
};
