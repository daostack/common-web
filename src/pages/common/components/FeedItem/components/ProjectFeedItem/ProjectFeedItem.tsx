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
  const commonId = item.data.id;
  const isProject = checkIsProject(common);
  const titleEl = (
    <>
      {common?.name}
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
          lastActivity: item.updatedAt.seconds * 1000,
          unreadMessages: 0,
          isMobileView: isMobileVersion,
          title: titleEl,
          lastMessage: parseStringToTextEditorValue("0 Updated streams"),
          onClick: handleClick,
          seenOnce: true,
          isLoading: !isCommonFetched,
          renderLeftContent,
        })}
      </>
    ) || null
  );
};
