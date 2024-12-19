import React from "react";
import classNames from "classnames";
import { Descendant, Element } from "slate";
import { UserService } from "@/services";
import { DirectParent, User } from "@/shared/models";
import { countTextEditorEmojiElements } from "@/shared/ui-kit";
import {
  getMentionTags,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit/TextEditor";
import { ElementType } from "@/shared/ui-kit/TextEditor/constants";
import textEditorElementsStyles from "@/shared/ui-kit/TextEditor/shared/TextEditorElements.module.scss";
import { EmojiElement } from "@/shared/ui-kit/TextEditor/types";
import { isRtlWithNoMentions } from "@/shared/ui-kit/TextEditor/utils";
import { InternalLinkData } from "@/shared/utils";
import { CheckboxItem, StreamMention, UserMention, DiscussionLink } from "../components";
import { Text, TextData } from "../types";
import { generateInternalLink } from "./generateInternalLink";
import { getTextFromSystemMessage } from "./getTextFromSystemMessage";

interface ChatEmoji {
  descendant: EmojiElement;
  emojiTextClassName?: string;
}

const ChatEmoji = ({ descendant, emojiTextClassName }: ChatEmoji) => {
  return <span className={emojiTextClassName}>{descendant.emoji}</span>;
};

interface TextFromDescendant {
  descendant: Descendant;
  users: User[];
  mentionTextClassName?: string;
  emojiTextClassName?: string;
  commonId?: string;
  directParent?: DirectParent | null;
  onUserClick?: (userId: string) => void;
  onStreamMentionClick?: (feedItemId: string) => void;
  onInternalLinkClick?: (data: InternalLinkData) => void;
  showPlainText?: boolean;
}

const getTextFromDescendant = async ({
  descendant,
  users,
  mentionTextClassName,
  emojiTextClassName,
  commonId,
  directParent,
  onUserClick,
  onStreamMentionClick,
  onInternalLinkClick,
  showPlainText,
}: TextFromDescendant): Promise<Text> => {
  if (!Element.isElement(descendant)) {
    const separatedText = descendant.text.split(" ");
    if (showPlainText) {
      return descendant.text;
    }
    const mappedText = await Promise.all(
      separatedText.map(async (text) => {
        return await generateInternalLink({ text, onInternalLinkClick });
      }),
    );
    return mappedText ? <span>{mappedText}</span> : "";
  }

  switch (descendant.type) {
    case ElementType.Paragraph:
    case ElementType.Link:
      return (
        <span>
          {await Promise.all(
            descendant.children.map(async (item, index) => (
              <React.Fragment key={index}>
                {await getTextFromDescendant({
                  descendant: item,
                  users,
                  mentionTextClassName,
                  emojiTextClassName,
                  commonId,
                  directParent,
                  onUserClick,
                  onStreamMentionClick,
                  onInternalLinkClick,
                  showPlainText,
                })}
              </React.Fragment>
            )),
          )}
          <br />
        </span>
      );
    case ElementType.Mention:
      return (
        <UserMention
          users={users}
          userId={descendant.userId}
          displayName={descendant.displayName}
          mentionTextClassName={mentionTextClassName}
          onUserClick={onUserClick}
        />
      );
    case ElementType.StreamMention:
      return (
        <StreamMention
          discussionId={descendant.discussionId}
          title={descendant.title}
          commonId={descendant.commonId}
          mentionTextClassName={mentionTextClassName}
          onStreamMentionClick={onStreamMentionClick}
        />
      );
    case ElementType.DiscussionLink:
      return (
        <DiscussionLink
          link={descendant.link}
          title={descendant.title}
          mentionTextClassName={mentionTextClassName}
          onInternalLinkClick={onInternalLinkClick}
        />
      );
    case ElementType.Emoji:
      return (
        <ChatEmoji
          descendant={descendant}
          emojiTextClassName={emojiTextClassName}
        />
      );
    case ElementType.CheckboxItem:
      return (
        <CheckboxItem
          id={descendant.id}
          checked={descendant.checked}
          isRTL={isRtlWithNoMentions([descendant])}
        >
          {await Promise.all(
            descendant.children.map(async (item, index) => (
              <React.Fragment key={index}>
                {await getTextFromDescendant({
                  descendant: item,
                  users,
                  mentionTextClassName,
                  emojiTextClassName,
                  commonId,
                  directParent,
                  onUserClick,
                })}
              </React.Fragment>
            )),
          )}
        </CheckboxItem>
      );
    default:
      return descendant.text || "";
  }
};

export const getTextFromTextEditorString = async (
  data: TextData,
): Promise<Text[]> => {
  const {
    userId,
    ownerId,
    textEditorString,
    users,
    mentionTextClassName,
    emojiTextClassName,
    commonId,
    systemMessage,
    directParent,
    onUserClick,
    onFeedItemClick,
    onStreamMentionClick,
    onInternalLinkClick,
    showPlainText,
  } = data;

  const isCurrentUser = userId === ownerId;

  if (systemMessage) {
    const systemMessageText = await getTextFromSystemMessage(data);

    if (systemMessageText) {
      return systemMessageText;
    }
  }

  const textEditorValue = parseStringToTextEditorValue(textEditorString);

  const emojiCount = countTextEditorEmojiElements(textEditorValue);
  const mentionTags = getMentionTags(textEditorValue);
  const allNecessaryUsers = await Promise.all(
    mentionTags.map(async (mentionTag) => {
      try {
        return (
          users.find((user) => user.uid === mentionTag.userId) ||
          (await UserService.getUserById(mentionTag.userId))
        );
      } catch (error) {
        return null;
      }
    }),
  );
  const filteredUsers = allNecessaryUsers.filter((user): user is User =>
    Boolean(user),
  );

  const mentionCurrentUserTextStyle = isCurrentUser
    ? textEditorElementsStyles.mentionTextCurrentUser
    : "";

  return await Promise.all(
    textEditorValue.map(async (item, index) => (
      <React.Fragment key={index}>
        {await getTextFromDescendant({
          descendant: item,
          users: filteredUsers,
          mentionTextClassName:
            mentionTextClassName || mentionCurrentUserTextStyle,
          emojiTextClassName:
            emojiTextClassName ||
            classNames({
              [textEditorElementsStyles.singleEmojiText]:
                emojiCount.isSingleEmoji,
              [textEditorElementsStyles.multipleEmojiText]:
                emojiCount.isMultipleEmoji,
            }),
          commonId,
          directParent,
          onUserClick,
          onStreamMentionClick: onStreamMentionClick ?? onFeedItemClick,
          onInternalLinkClick,
          showPlainText,
        })}
      </React.Fragment>
    )),
  );
};
