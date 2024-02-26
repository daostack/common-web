import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import data, { Skin } from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Theme } from "@/shared/constants";
import {
  useChatMessageReaction,
  useDiscussionMessageReaction,
} from "@/shared/hooks/useCases";
import { EmojiIcon } from "@/shared/icons";
import { selectTheme } from "@/shared/store/selectors";
import { ButtonIcon } from "@/shared/ui-kit";
import styles from "./ReactWithEmoji.module.scss";

interface ReactWithEmojiProps {
  show: boolean;
  discussionMessageId?: string;
  className?: string;
  pickerContainerClassName?: string;
  chatMessageId?: string;
  chatChannelId?: string;
}

export const ReactWithEmoji: FC<ReactWithEmojiProps> = (props) => {
  const {
    show,
    discussionMessageId,
    className,
    pickerContainerClassName,
    chatMessageId,
    chatChannelId,
  } = props;
  const theme = useSelector(selectTheme);
  const [isOpen, setIsOpen] = useState(false);
  const { reactToDiscussionMessage } = useDiscussionMessageReaction();
  const { reactToChatMessage } = useChatMessageReaction();

  if (!show) {
    return null;
  }

  const onEmojiSelect = (emoji: Skin) => {
    if (chatMessageId && chatChannelId) {
      reactToChatMessage({
        emoji: emoji.native,
        chatMessageId,
        chatChannelId,
      });
    } else if (discussionMessageId) {
      reactToDiscussionMessage({
        emoji: emoji.native,
        discussionMessageId,
      });
    }
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
