import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
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
  const { getUserReaction } = useUserReaction();
  const [userReaction, setUserReaction] = useState<
    UserReaction | null | undefined
  >(null);

  if (!reactions || !userId) {
    return null;
  }

  useEffect(() => {
    (async () => {
      if (discussionMessageId) {
        const userReaction = await getUserReaction(discussionMessageId);
        setUserReaction(userReaction);
      }
    })();
  }, [discussionMessageId]);

  /**
   * TODO: improve
   */
  const onEmojiSelect = (emoji: string) => {
    if (userReaction?.userId === userId && userReaction.emoji === emoji) {
      if (chatMessageId && chatChannelId) {
        removeChatMessageReaction(chatMessageId, chatChannelId);
      } else if (discussionMessageId) {
        removeDiscussionMessageReaction(discussionMessageId);
      }
    }
  };

  const totalCount = Object.values(reactions).reduce((a, b) => a + b, 0);
  const emojis = Object.keys(reactions)
    .filter((key) => reactions[key] > 0)
    .map((emoji) => (
      <span
        className={classNames({
          [styles.currentUserReaction]:
            userReaction?.userId === userId && userReaction.emoji === emoji,
        })}
        onClick={() => onEmojiSelect(emoji)}
      >
        {emoji}
      </span>
    ));

  return (
    <div className={styles.container}>
      {totalCount > 1 && (
        <span className={styles.totalCount}>{totalCount}</span>
      )}
      {emojis}
    </div>
  );
};
