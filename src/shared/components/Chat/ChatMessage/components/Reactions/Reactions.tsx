import React, { FC, useEffect, useMemo, useState } from "react";
import { isEmpty } from "lodash";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useUserReaction, useUsersByIds } from "@/shared/hooks/useCases";
import { ReactionCounts, UserReaction } from "@/shared/models";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui-kit";
import styles from "./Reactions.module.scss";

interface ReactionsProps {
  reactions?: ReactionCounts | null;
  discussionMessageId?: string;
  chatMessageId?: string;
  chatChannelId?: string;
}

export const Reactions: FC<ReactionsProps> = (props) => {
  const { reactions, discussionMessageId, chatMessageId, chatChannelId } =
    props;
  const { getUserReaction, getDMUserReaction } = useUserReaction({
    fetchAll: true,
  });
  const { fetchUsers, data: users, fetched } = useUsersByIds();
  const [usersReactions, setUsersReactions] = useState<
    UserReaction[] | null | undefined
  >(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (discussionMessageId) {
        const usersReactions = await getUserReaction(discussionMessageId);

        if (isMounted) {
          setUsersReactions(usersReactions);
        }
      } else if (chatMessageId && chatChannelId) {
        const userReaction = await getDMUserReaction(
          chatMessageId,
          chatChannelId,
        );

        if (isMounted) {
          setUsersReactions(userReaction);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [discussionMessageId, chatMessageId, chatChannelId, reactions]);

  useEffect(() => {
    if (usersReactions) {
      fetchUsers(usersReactions.map((user) => user.userId));
    }
  }, [usersReactions]);

  if (!reactions || isEmpty(reactions)) {
    return null;
  }

  const totalCount = Object.values(reactions).reduce((a, b) => a + b, 0);

  if (totalCount === 0) {
    return null;
  }

  const emojis = Object.keys(reactions)
    .filter((key) => reactions[key] > 0)
    .map((emoji, index) => <span key={index}>{emoji}</span>);

  const list = useMemo(() => {
    if (users) {
      return users.map((user) => {
        const userReaction = usersReactions?.find(
          (elem) => elem.userId === user.uid,
        )?.emoji;
        return (
          <div className={styles.listItem}>
            <UserAvatar
              photoURL={user.photoURL}
              className={styles.userAvatar}
            />
            <span className={styles.listUsername}>{user.displayName}</span>
            <span className={styles.listItemEmoji}>{userReaction}</span>
          </div>
        );
      });
    }
  }, [users, usersReactions]);

  return (
    <div className={styles.container}>
      {totalCount > 1 && (
        <span className={styles.totalCount}>{totalCount}</span>
      )}
      <Tooltip>
        <TooltipTrigger className={styles.reactionsTooltipTrigger}>
          {emojis}
        </TooltipTrigger>
        <TooltipContent className={styles.reactionsTooltipContent}>
          {!fetched && !users && "Loading..."}
          {fetched && list}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
