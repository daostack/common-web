import React, { FC } from "react";
import {
  useChatMessageReaction,
  useDiscussionMessageReaction,
} from "@/shared/hooks/useCases";
import { ReactionCounts } from "@/shared/models";
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
  const { removeDiscussionMessageReaction } = useDiscussionMessageReaction();
  const { removeChatMessageReaction } = useChatMessageReaction();

  if (!reactions) {
    return null;
  }

  const onEmojiSelect = () => {
    if (chatMessageId && chatChannelId) {
      removeChatMessageReaction(chatMessageId, chatChannelId);
    } else if (discussionMessageId) {
      removeDiscussionMessageReaction(discussionMessageId);
    }
  };

  const totalCount = Object.values(reactions).reduce((a, b) => a + b, 0);
  const emojis = Object.keys(reactions)
    .filter((key) => reactions[key] > 0)
    .map((emoji) => <span>{emoji}</span>);

  return (
    <div className={styles.container}>
      {totalCount > 1 && (
        <span className={styles.totalCount}>{totalCount}</span>
      )}
      {emojis}
    </div>
  );
};
