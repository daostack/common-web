import React, { FC, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useFeedItemContext } from "@/pages/common";
import { useRoutesContext } from "@/shared/contexts";
import { useCommon } from "@/shared/hooks/useCases";
import { CommonFeed } from "@/shared/models";
import { parseStringToTextEditorValue } from "@/shared/ui-kit";

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

  const handleClick = useCallback(() => {
    history.push(getCommonPagePath(commonId));
  }, [history.push, getCommonPagePath, commonId]);

  // const handleChatChannelUpdate = useCallback(
  //   (item: ChatChannel, isRemoved: boolean) => {
  //     dispatch(
  //       inboxActions.updateChatChannelItem({
  //         item,
  //         isRemoved,
  //       }),
  //     );
  //   },
  //   [dispatch],
  // );
  //
  // const renderImage = (className?: string) => (
  //   <UserAvatar
  //     className={className}
  //     photoURL={dmUser?.photoURL}
  //     nameForRandomAvatar={dmUserName}
  //     userName={dmUserName}
  //   />
  // );

  useEffect(() => {
    fetchCommon(commonId);
  }, [commonId]);

  // useEffect(() => {
  //   fetchChatChannelUserStatus({
  //     userId: userId || "",
  //     chatChannelId: chatChannel.id,
  //   });
  // }, [userId, chatChannel.id]);

  return (
    (
      <>
        {renderFeedItemBaseContent?.({
          lastActivity: item.updatedAt.seconds * 1000,
          unreadMessages: 0,
          isMobileView: isMobileVersion,
          title: common?.name,
          lastMessage: parseStringToTextEditorValue("4 Updated streams"),
          onClick: handleClick,
          seenOnce: true,
        })}
      </>
    ) || null
  );
};
