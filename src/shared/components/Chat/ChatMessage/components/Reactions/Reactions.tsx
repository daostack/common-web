import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { isEmpty } from "lodash";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  useChatMessageReaction,
  useDiscussionMessageReaction,
  useUserReaction,
} from "@/shared/hooks/useCases";
import { ReactionCounts, UserReaction } from "@/shared/models";
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
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const { removeDiscussionMessageReaction } = useDiscussionMessageReaction();
  const { removeChatMessageReaction } = useChatMessageReaction();
  const { getUserReaction, getDMUserReaction } = useUserReaction();
  const [userReaction, setUserReaction] = useState<
    UserReaction | null | undefined
  >(null);

  useEffect(() => {
    (async () => {
      if (discussionMessageId) {
        const userReaction = await getUserReaction(discussionMessageId);
        setUserReaction(userReaction);
      } else if (chatMessageId && chatChannelId) {
        const userReaction = await getDMUserReaction(
          chatMessageId,
          chatChannelId,
        );
        setUserReaction(userReaction);
      }
    })();
  }, [reactions, discussionMessageId]);

  if (!reactions || isEmpty(reactions)) {
    return null;
  }

  const onEmojiRemove = () => {
    if (chatMessageId && chatChannelId) {
      removeChatMessageReaction(chatMessageId, chatChannelId);
    } else if (discussionMessageId) {
      removeDiscussionMessageReaction(discussionMessageId);
    }
  };

  const totalCount = Object.values(reactions).reduce((a, b) => a + b, 0);
  const emojis = Object.keys(reactions)
    .filter((key) => reactions[key] > 0)
    .map((emoji) => {
      const isCurrentUserReaction =
        userReaction?.userId === userId && userReaction?.emoji === emoji;
      return (
        <span
          className={classNames({
            [styles.currentUserReaction]: isCurrentUserReaction,
          })}
          onClick={isCurrentUserReaction ? onEmojiRemove : undefined}
        >
          {emoji}
        </span>
      );
    });

  return (
    <div className={styles.container}>
      {totalCount > 1 && (
        <span className={styles.totalCount}>{totalCount}</span>
      )}
      {emojis}
    </div>
  );
};
