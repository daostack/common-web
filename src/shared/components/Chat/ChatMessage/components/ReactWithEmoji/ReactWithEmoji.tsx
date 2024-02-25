import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import data, { Skin } from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Theme } from "@/shared/constants";
import { useDiscussionMessageReaction } from "@/shared/hooks/useCases";
import { EmojiIcon } from "@/shared/icons";
import { selectTheme } from "@/shared/store/selectors";
import { ButtonIcon } from "@/shared/ui-kit";
import styles from "./ReactWithEmoji.module.scss";

interface ReactWithEmojiProps {
  show: boolean;
  discussionMessageId: string;
  className?: string;
  pickerContainerClassName?: string;
}

export const ReactWithEmoji: FC<ReactWithEmojiProps> = (props) => {
  const { show, discussionMessageId, className, pickerContainerClassName } =
    props;
  const theme = useSelector(selectTheme);
  const [isOpen, setIsOpen] = useState(false);
  const { reactToDiscussionMessage } = useDiscussionMessageReaction();

  if (!show) {
    return null;
  }

  const onEmojiSelect = (emoji: Skin) => {
    reactToDiscussionMessage({
      emoji: emoji.native,
      discussionMessageId,
    });
    setIsOpen(false);
  };

  return (
    <div className={classNames(styles.container, className)}>
      <ButtonIcon onClick={() => setIsOpen((isOpen) => !isOpen)}>
        <EmojiIcon />
      </ButtonIcon>

      {isOpen && (
        <div
          className={classNames(
            pickerContainerClassName || styles.pickerContainer,
          )}
        >
          <Picker
            data={data}
            onEmojiSelect={onEmojiSelect}
            theme={theme === Theme.Dark ? Theme.Dark : Theme.Light}
          />
        </div>
      )}
    </div>
  );
};
