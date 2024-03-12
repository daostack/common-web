import React, { FC, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { Skin } from "@emoji-mart/data";
import { selectUser } from "@/pages/Auth/store/selectors";
import { Logger } from "@/services";
import {
  useChatMessageReaction,
  useDiscussionMessageReaction,
} from "@/shared/hooks/useCases";
import { PlusIcon } from "@/shared/icons";
import { UserReaction } from "@/shared/models";
import { Button, ButtonIcon, ButtonVariant } from "@/shared/ui-kit";
import { cacheActions } from "@/store/states";
import { commonEmojis } from "./commonEmojis";
import styles from "./CompactPicker.module.scss";

interface CompactPickerProps {
  setShowAllEmojis: (show: boolean) => void;
  onEmojiSelect: (emoji: Skin) => void;
  discussionId?: string;
  discussionMessageId?: string;
  chatMessageId?: string;
  chatChannelId?: string;
  setShowPicker: (value: boolean) => void;
  userReaction?: UserReaction | null;
  setUserReaction: (userReacion?: UserReaction | null) => void;
}

export const CompactPicker: FC<CompactPickerProps> = (props) => {
  const {
    setShowAllEmojis,
    onEmojiSelect,
    discussionId,
    discussionMessageId,
    chatMessageId,
    chatChannelId,
    setShowPicker,
    userReaction,
    setUserReaction,
  } = props;

  const dispatch = useDispatch();
  const { removeDiscussionMessageReaction } = useDiscussionMessageReaction();
  const { removeChatMessageReaction } = useChatMessageReaction();
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const onEmojiRemove = (emoji: string) => {
    if (chatMessageId && chatChannelId) {
      removeChatMessageReaction(chatMessageId, chatChannelId);
    } else if (discussionMessageId) {
      removeDiscussionMessageReaction(discussionMessageId);
      try {
        dispatch(
          cacheActions.updateDiscussionMessageReactions({
            discussionId,
            discussionMessageId,
            emoji: emoji,
            prevUserEmoji: userReaction?.emoji,
          }),
        );
      } catch (error) {
        Logger.error(error);
      }
    }
    setUserReaction(null);
    setShowPicker(false);
  };

  const handleEmojiSelect = (isCurrentUserReaction: boolean, emoji: Skin) => {
    if (isCurrentUserReaction) {
      onEmojiRemove(emoji.native);
    } else {
      onEmojiSelect(emoji);
    }
  };

  const isEmojiInCommonPanel = useMemo(
    () => commonEmojis.some((emoji) => emoji.native === userReaction?.emoji),
    [commonEmojis, userReaction],
  );

  const finalCommonEmojis =
    userReaction && !isEmojiInCommonPanel
      ? [
          ...commonEmojis,
          { unified: userReaction.emoji, native: userReaction.emoji },
        ]
      : commonEmojis;

  return (
    <div className={styles.container}>
      <ButtonIcon
        className={styles.plusIcon}
        onClick={() => setShowAllEmojis(true)}
      >
        <PlusIcon />
      </ButtonIcon>
      {finalCommonEmojis?.map((emoji) => {
        const isCurrentUserReaction =
          userReaction?.userId === userId &&
          userReaction?.emoji === emoji.native;

        return (
          <Button
            key={emoji.unified}
            className={classnames(styles.emojiButton, {
              [styles.emojiActive]: isCurrentUserReaction,
            })}
            onClick={() => handleEmojiSelect(isCurrentUserReaction, emoji)}
            variant={ButtonVariant.Transparent}
          >
            {emoji.native}
          </Button>
        );
      })}
    </div>
  );
};
