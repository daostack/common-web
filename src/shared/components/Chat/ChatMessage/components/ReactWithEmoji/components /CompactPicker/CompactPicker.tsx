import React, { FC } from "react";
import { Skin } from "@emoji-mart/data";
import { PlusIcon } from "@/shared/icons";
import { Button, ButtonIcon, ButtonVariant } from "@/shared/ui-kit";
import { commonEmojis } from "./commonEmojis";
import styles from "./CompactPicker.module.scss";

interface CompactPickerProps {
  setShowAllEmojis: (show: boolean) => void;
  onEmojiSelect: (emoji: Skin) => void;
}

export const CompactPicker: FC<CompactPickerProps> = (props) => {
  const { setShowAllEmojis, onEmojiSelect } = props;

  return (
    <div className={styles.container}>
      <ButtonIcon
        className={styles.plusIcon}
        onClick={() => setShowAllEmojis(true)}
      >
        <PlusIcon />
      </ButtonIcon>
      {commonEmojis.map((emoji) => (
        <Button
          key={emoji.unified}
          className={styles.emojiButton}
          onClick={() => onEmojiSelect(emoji)}
          variant={ButtonVariant.Transparent}
        >
          {emoji.native}
        </Button>
      ))}
    </div>
  );
};
