import React, {
  CSSProperties,
  FC,
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useCollapse } from "react-collapsed";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { useFeedItemContext } from "@/pages/common";
import { ButtonIcon } from "@/shared/components";
import { useRoutesContext } from "@/shared/contexts";
import {
  useCommon,
  useFeedItemFollow,
  useGovernanceByCommonId,
} from "@/shared/hooks/useCases";
import { OpenIcon, SmallArrowIcon } from "@/shared/icons";
import { SpaceListVisibility } from "@/shared/interfaces";
import { CommonFeed } from "@/shared/models";
import {
  CommonAvatar,
  Loader,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit";
import { checkIsProject } from "@/shared/utils";
import { CommonCard } from "../../../CommonCard";
import { COLLAPSE_DURATION } from "../../../FeedCard/constants";
import { useFeedItemCounters } from "../../hooks";
import { FeedItems } from "./components";
import { useFeedItems } from "./hooks";
import styles from "./ProjectFeedItem.module.scss";

interface ProjectFeedItemProps {
  item: CommonFeed;
  isMobileVersion: boolean;
  level?: number;
}

export const ProjectFeedItem: FC<ProjectFeedItemProps> = (props) => {
  const { item, isMobileVersion, level = 1 } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const { getCommonPagePath } = useRoutesContext();
  const { renderFeedItemBaseContent, feedCardSettings } = useFeedItemContext();
  const { data: common, fetched: isCommonFetched, fetchCommon } = useCommon();
  const { data: governance, fetchGovernance } = useGovernanceByCommonId();
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember({
    shouldAutoReset: false,
    withSubscription: true,
    commonId: item.data.id,
    governanceCircles: governance?.circles,
  });
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
    hasMoreItems,
    fetched,
    fetchFeedItems,
    onFeedItemUpdate,
  } = useFeedItems(commonId, userId, { common, commonMember });
  const [isExpanded, setIsExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded,
    duration: COLLAPSE_DURATION,
  });
  const isLoading = !fetched;
  const lastMessage = useMemo(() => parseStringToTextEditorValue(
    `${unreadStreamsCount ?? 0} unread stream${
      unreadStreamsCount === 1 ? "" : "s"
    }`,
  ),[unreadStreamsCount]);
  const commonPath = getCommonPagePath(commonId);
  const isProject = checkIsProject(common);
  const titleEl = useMemo(
    () => (
      <>
        <span className={styles.title}>{common?.name}</span>
        <OpenIcon className={styles.openIcon} />
      </>
    ),
    [common?.name],
  );

  const handleClick = useCallback(() => {
    history.push(commonPath);
  }, [history, commonPath]);

  const handleExpand: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation();
      setIsExpanded((v) => !v);
    },
    [setIsExpanded],
  );

  const renderLeftContent = useCallback(
    () => (
      <div className={styles.leftContent}>
        <ButtonIcon
          className={styles.arrowIconButton}
          onClick={handleExpand}
          aria-label={`${isExpanded ? "Hide" : "Show"} ${
            common?.name
          }'s spaces`}
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
    ),
    [common?.image, common?.name, isExpanded, isProject, handleExpand],
  );

  useEffect(() => {
    fetchCommonMember(commonId);
    fetchCommon(commonId);
    fetchGovernance(commonId);
  }, [commonId]);

  useEffect(() => {
    if (isExpanded) {
      fetchFeedItems();
    }
  }, [isExpanded]);

  const feedItemProps = useMemo(
    () => ({
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
    }),
    [
      item.updatedAt.seconds,
      isMobileVersion,
      titleEl,
      handleClick,
      handleExpand,
      isCommonFetched,
      unreadMessages,
      lastMessage,
      unreadStreamsCount,
      renderLeftContent,
      feedItemFollow.isFollowing,
      common?.notion,
    ],
  );

  if (
    !isCommonMemberFetched ||
    (!commonMember && common?.listVisibility === SpaceListVisibility.Members)
  ) {
    return null;
  }

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
        {renderFeedItemBaseContent?.(feedItemProps)}
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
          {isLoading && <Loader className={styles.loader} />}
          {!isLoading && common && (
            <>
              <FeedItems
                common={common}
                commonMember={commonMember}
                feedItems={feedItems}
                level={level}
                onFeedItemUpdate={onFeedItemUpdate}
              />
              {hasMoreItems && (
                <NavLink
                  className={styles.moreItemsTextContainer}
                  to={commonPath}
                >
                  More items in {common.name}
                  <OpenIcon className={styles.moreItemsTextIcon} />
                </NavLink>
              )}
            </>
          )}
        </CommonCard>
      </div>
    </div>
  );
};
