import React, { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";
import { Skin } from "@emoji-mart/data";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  useChatMessageReaction,
  useDiscussionMessageReaction,
  useUserReaction,
} from "@/shared/hooks/useCases";
import { PlusIcon } from "@/shared/icons";
import { UserReaction } from "@/shared/models";
import { Button, ButtonIcon, ButtonVariant } from "@/shared/ui-kit";
import { commonEmojis } from "./commonEmojis";
import styles from "./CompactPicker.module.scss";

interface CompactPickerProps {
  setShowAllEmojis: (show: boolean) => void;
  onEmojiSelect: (emoji: Skin) => void;
  discussionMessageId?: string;
  chatMessageId?: string;
  chatChannelId?: string;
  setShowPicker: (value: boolean) => void;
}

export const CompactPicker: FC<CompactPickerProps> = (props) => {
  const {
    setShowAllEmojis,
    onEmojiSelect,
    discussionMessageId,
    chatMessageId,
    chatChannelId,
    setShowPicker,
  } = props;
  const { getUserReaction, getDMUserReaction } = useUserReaction();
  const { removeDiscussionMessageReaction } = useDiscussionMessageReaction();
  const { removeChatMessageReaction } = useChatMessageReaction();
  const [userReaction, setUserReaction] = useState<
    UserReaction | null | undefined
  >(null);
  const user = useSelector(selectUser());
  const userId = user?.uid;

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
  }, [discussionMessageId, chatMessageId, chatChannelId]);

  const onEmojiRemove = () => {
    if (chatMessageId && chatChannelId) {
      removeChatMessageReaction(chatMessageId, chatChannelId);
    } else if (discussionMessageId) {
      removeDiscussionMessageReaction(discussionMessageId);
    }
    setShowPicker(false);
  };

  const handleEmojiSelect = (isCurrentUserReaction: boolean, emoji: Skin) => {
    if (isCurrentUserReaction) {
      onEmojiRemove();
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
