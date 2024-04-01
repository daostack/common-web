import React, { FC, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { useUserReaction, useUsersByIds } from "@/shared/hooks/useCases";
import { ReactionCounts, UserReaction } from "@/shared/models";
import styles from "./Reactions.module.scss";

interface ReactionsProps {
  reactions?: ReactionCounts | null;
  discussionMessageId?: string;
}

export const Reactions: FC<ReactionsProps> = (props) => {
  const { reactions, discussionMessageId } = props;
  const { getUserReaction } = useUserReaction({ fetchAll: true });
  const { fetchUsers, data: users } = useUsersByIds();
  const [usersReactions, setUsersReactions] = useState<
    UserReaction[] | null | undefined
  >(null);

  if (usersReactions) {
    console.log(usersReactions);
  }

  if (users) {
    console.log(users);
  }

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (discussionMessageId) {
        const usersReactions = await getUserReaction(discussionMessageId);

        if (isMounted) {
          setUsersReactions(usersReactions as UserReaction[]);
        }
      }

      // else if (chatMessageId && chatChannelId) {
      //   const userReaction = await getDMUserReaction(
      //     chatMessageId,
      //     chatChannelId,
      //   );

      //   if (isMounted) {
      //     setUserReaction(userReaction);
      //   }
      // }
    })();

    return () => {
      isMounted = false;
    };
  }, [discussionMessageId]); // , chatMessageId, chatChannelId

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

  return (
    <div className={styles.container}>
      {totalCount > 1 && (
        <span className={styles.totalCount}>{totalCount}</span>
      )}
      {emojis}
    </div>
  );
};
