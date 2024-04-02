import React, { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { selectUser } from "@/pages/Auth/store/selectors";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useUserReaction } from "@/shared/hooks/useCases";
import { ReactionCounts, User, UserReaction } from "@/shared/models";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui-kit";
import styles from "./Reactions.module.scss";

interface ReactionsProps {
  reactions?: ReactionCounts | null;
  discussionMessageId?: string;
  chatMessageId?: string;
  chatChannelId?: string;
  users?: User[];
}

export const Reactions: FC<ReactionsProps> = (props) => {
  const {
    reactions,
    discussionMessageId,
    chatMessageId,
    chatChannelId,
    users,
  } = props;
  const currentUser = useSelector(selectUser());

  const { getUserReaction, getDMUserReaction } = useUserReaction({
    fetchAll: true,
  });
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

  const usersList = useMemo(() => {
    if (users && usersReactions && currentUser) {
      return [...users, currentUser].map((user, index) => {
        const userReaction = usersReactions.find(
          (elem) => elem.userId === user.uid,
        )?.emoji;

        if (userReaction) {
          return (
            <div key={index} className={styles.listItem}>
              <UserAvatar
                photoURL={user.photoURL}
                className={styles.userAvatar}
              />
              <span className={styles.listUsername}>{user.displayName}</span>
              <span className={styles.listItemEmoji}>{userReaction}</span>
            </div>
          );
        }
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
          {usersList ? usersList : "Loading..."}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
