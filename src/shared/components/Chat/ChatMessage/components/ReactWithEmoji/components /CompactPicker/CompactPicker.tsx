import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";
import { Skin } from "@emoji-mart/data";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useUserReaction } from "@/shared/hooks/useCases";
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
}

export const CompactPicker: FC<CompactPickerProps> = (props) => {
  const {
    setShowAllEmojis,
    onEmojiSelect,
    discussionMessageId,
    chatMessageId,
    chatChannelId,
  } = props;
  const { getUserReaction, getDMUserReaction } = useUserReaction();
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

  return (
    <div className={styles.container}>
      <ButtonIcon
        className={styles.plusIcon}
        onClick={() => setShowAllEmojis(true)}
      >
        <PlusIcon />
      </ButtonIcon>
      {commonEmojis.map((emoji) => {
        const isCurrentUserReaction =
          userReaction?.userId === userId &&
          userReaction?.emoji === emoji.native;

        return (
          <Button
            key={emoji.unified}
            className={classnames(styles.emojiButton, {
              [styles.emojiActive]: isCurrentUserReaction,
            })}
            onClick={() => onEmojiSelect(emoji)}
            variant={ButtonVariant.Transparent}
          >
            {emoji.native}
          </Button>
        );
      })}
    </div>
  );
};
