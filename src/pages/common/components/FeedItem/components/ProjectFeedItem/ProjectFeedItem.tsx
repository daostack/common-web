import React, { FC, ReactNode, useEffect } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { useFeedItemContext } from "@/pages/common";
import { useRoutesContext } from "@/shared/contexts";
import { useCommon } from "@/shared/hooks/useCases";
import { OpenIcon } from "@/shared/icons";
import { CommonFeed } from "@/shared/models";
import { CommonAvatar, parseStringToTextEditorValue } from "@/shared/ui-kit";
import { checkIsProject } from "@/shared/utils";
import { useFeedItemCounters } from "../../hooks";
import styles from "./ProjectFeedItem.module.scss";

interface ProjectFeedItemProps {
  item: CommonFeed;
  isMobileVersion: boolean;
}

export const ProjectFeedItem: FC<ProjectFeedItemProps> = (props) => {
  const { item, isMobileVersion } = props;
  const history = useHistory();
  const { getCommonPagePath } = useRoutesContext();
  const { renderFeedItemBaseContent } = useFeedItemContext();
  const { data: common, fetched: isCommonFetched, fetchCommon } = useCommon();
  const { unreadStreamsCount, unreadMessages } = useFeedItemCounters(item);
  const commonId = item.data.id;
  const lastMessage = parseStringToTextEditorValue(
    Number.isInteger(unreadStreamsCount)
      ? `${unreadStreamsCount} updated stream${
          unreadStreamsCount === 1 ? "" : "s"
        }`
      : undefined,
  );
  const isProject = checkIsProject(common);
  const titleEl = (
    <>
      <span className={styles.title}>{common?.name}</span>
      <OpenIcon className={styles.openIcon} />
    </>
  );

  const handleClick = () => {
    history.push(getCommonPagePath(commonId));
  };

  const renderLeftContent = (): ReactNode => (
    <CommonAvatar
      className={classNames(styles.image, {
        [styles.imageNonRounded]: !isProject,
        [styles.imageRounded]: isProject,
      })}
      src={common?.image}
      alt={`${common?.name}'s image`}
      name={common?.name}
    />
  );

  useEffect(() => {
    fetchCommon(commonId);
  }, [commonId]);

  return (
    (
      <>
        {renderFeedItemBaseContent?.({
          className: styles.container,
          titleWrapperClassName: styles.titleWrapper,
          lastActivity: item.updatedAt.seconds * 1000,
          isMobileView: isMobileVersion,
          title: titleEl,
          onClick: handleClick,
          seenOnce: true,
          isLoading: !isCommonFetched,
          unreadMessages,
          lastMessage,
          renderLeftContent,
          shouldHideBottomContent: !lastMessage,
        })}
      </>
    ) || null
  );
};
