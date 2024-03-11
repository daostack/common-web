import React, { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import data, { Skin } from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { selectUser } from "@/pages/Auth/store/selectors";
import { Logger } from "@/services";
import { Theme } from "@/shared/constants";
import { useOutsideClick } from "@/shared/hooks";
import {
  useChatMessageReaction,
  useDiscussionMessageReaction,
  useUserReaction,
} from "@/shared/hooks/useCases";
import { EmojiIcon } from "@/shared/icons";
import { UserReaction } from "@/shared/models";
import { selectTheme } from "@/shared/store/selectors";
import { ButtonIcon } from "@/shared/ui-kit";
import { cacheActions } from "@/store/states";
import { CompactPicker } from "./components /CompactPicker";
import styles from "./ReactWithEmoji.module.scss";

interface ReactWithEmojiProps {
  showEmojiButton: boolean;
  discussionId?: string;
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
    discussionId,
    discussionMessageId,
    className,
    pickerContainerClassName,
    chatMessageId,
    chatChannelId,
    isNotCurrentUserMessage,
  } = props;
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const theme = useSelector(selectTheme);
  const [showPicker, setShowPicker] = useState(false);
  const [showAllEmojis, setShowAllEmojis] = useState(false);
  const [userReaction, setUserReaction] = useState<
    UserReaction | null | undefined
  >(null);
  const wrapperRef = useRef(null);
  const { isOutside, setOutsideValue } = useOutsideClick(wrapperRef);
  const { reactToDiscussionMessage } = useDiscussionMessageReaction();
  const { reactToChatMessage } = useChatMessageReaction();
  const { getUserReaction, getDMUserReaction } = useUserReaction();

  useEffect(() => {
    if (isOutside) {
      setShowAllEmojis(false);
      setShowPicker(false);
      setOutsideValue();
    }
  }, [isOutside, setOutsideValue]);

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
      try {
        dispatch(
          cacheActions.updateDiscussionMessageReactions({
            discussionId,
            discussionMessageId,
            emoji: emoji.native,
            prevUserEmoji: userReaction?.emoji,
          }),
        );
      } catch (error) {
        Logger.error(error);
      }
    }
    if (userId) {
      setUserReaction({ emoji: emoji.native, userId: userId });
    }
    setShowAllEmojis(false);
    setShowPicker(false);
  };

  const handleEmojiButtonClick = () => {
    setShowPicker(!showPicker);
  };

  return (
    <div ref={wrapperRef} className={classNames(className)}>
      <ButtonIcon
        onClick={handleEmojiButtonClick}
        className={classNames(styles.emojiButton, {
          [styles.show]: showEmojiButton || showPicker,
        })}
      >
        <EmojiIcon />
      </ButtonIcon>

      {showPicker && (
        <div
          className={classNames(
            pickerContainerClassName || styles.pickerContainer,
            {
              [styles.isNotCurrentUserMessage]: isNotCurrentUserMessage,
            },
          )}
        >
          {showAllEmojis ? (
            <Picker
              data={data}
              onEmojiSelect={onEmojiSelect}
              theme={theme === Theme.Dark ? Theme.Dark : Theme.Light}
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
              discussionId={discussionId}
              discussionMessageId={discussionMessageId}
              chatMessageId={chatMessageId}
              chatChannelId={chatChannelId}
              setShowPicker={setShowPicker}
              userReaction={userReaction}
              setUserReaction={setUserReaction}
            />
          )}
        </div>
      )}
    </div>
  );
};
