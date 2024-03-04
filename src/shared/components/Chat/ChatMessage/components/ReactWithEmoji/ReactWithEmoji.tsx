import React, { FC, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import data, { Skin } from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Theme } from "@/shared/constants";
import { useOutsideClick } from "@/shared/hooks";
import {
  useChatMessageReaction,
  useDiscussionMessageReaction,
} from "@/shared/hooks/useCases";
import { EmojiIcon } from "@/shared/icons";
import { selectTheme } from "@/shared/store/selectors";
import { ButtonIcon } from "@/shared/ui-kit";
import { CompactPicker } from "./components /CompactPicker";
import styles from "./ReactWithEmoji.module.scss";

interface ReactWithEmojiProps {
  showEmojiButton: boolean;
  discussionMessageId?: string;
  className?: string;
  pickerContainerClassName?: string;
  chatMessageId?: string;
  chatChannelId?: string;
  isNotCurrentUserMessage: boolean;
}

export const ReactWithEmoji: FC<ReactWithEmojiProps> = (props) => {
  const {
    showEmojiButton,
    discussionMessageId,
    className,
    pickerContainerClassName,
    chatMessageId,
    chatChannelId,
    isNotCurrentUserMessage,
  } = props;
  const theme = useSelector(selectTheme);
  const [showPicker, setShowPicker] = useState(false);
  const [showAllEmojis, setShowAllEmojis] = useState(false);
  const wrapperRef = useRef(null);
  const { isOutside, setOutsideValue } = useOutsideClick(wrapperRef);
  const buttonRef = useRef<HTMLButtonElement>(null);
  //const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const { reactToDiscussionMessage } = useDiscussionMessageReaction();
  const { reactToChatMessage } = useChatMessageReaction();

  useEffect(() => {
    if (isOutside) {
      setShowAllEmojis(false);
      setShowPicker(false);
      setOutsideValue();
    }
  }, [isOutside, setOutsideValue]);

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
    setShowAllEmojis(false);
    setShowPicker(false);
  };

  const handleEmojiButtonClick = () => {
    // if (buttonRef.current) {
    //   const rect = buttonRef.current.getBoundingClientRect();
    //   setPickerPosition({
    //     top: rect.top + rect.height,
    //     left: rect.left,
    //   });
    // }
    setShowPicker(!showPicker);
  };

  return (
    <div ref={wrapperRef} className={classNames(className)}>
      {(showEmojiButton || showPicker) && (
        <ButtonIcon ref={buttonRef} onClick={handleEmojiButtonClick}>
          <EmojiIcon />
        </ButtonIcon>
      )}

      {showPicker && (
        <div
          className={classNames(
            pickerContainerClassName || styles.pickerContainer,
            {
              [styles.isNotCurrentUserMessage]: isNotCurrentUserMessage,
            },
          )}
          // style={{
          //   top: `${pickerPosition.top}px`,
          //   left: `${pickerPosition.left}px`,
          // }}
        >
          {showAllEmojis ? (
            <Picker
              data={data}
              onEmojiSelect={onEmojiSelect}
              theme={theme === Theme.Dark ? Theme.Dark : Theme.Light}
              searchPosition="none"
              navPosition="none"
              maxFrequentRows={0}
              perLine={5}
              previewPosition="none"
              skinTonePosition="none"
            />
          ) : (
            <CompactPicker
              setShowAllEmojis={setShowAllEmojis}
              onEmojiSelect={onEmojiSelect}
            />
          )}
        </div>
      )}
    </div>
  );
};
