import React from "react";
import { Descendant, Element } from "slate";
import { UserService } from "@/services";
import { DirectParent, User } from "@/shared/models";
import {
  getMentionTags,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit/TextEditor";
import { ElementType } from "@/shared/ui-kit/TextEditor/constants";
import { EmojiElement } from "@/shared/ui-kit/TextEditor/types";
import { CheckboxItem, UserMention } from "../components";
import { Text, TextData } from "../types";
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
}

const getTextFromDescendant = ({
  descendant,
  users,
  mentionTextClassName,
  emojiTextClassName,
  commonId,
  directParent,
  onUserClick,
}: TextFromDescendant): Text => {
  if (!Element.isElement(descendant)) {
    return descendant.text || "";
  }

  switch (descendant.type) {
    case ElementType.Paragraph:
    case ElementType.Link:
      return (
        <span>
          {descendant.children.map((item, index) => (
            <React.Fragment key={index}>
              {getTextFromDescendant({
                descendant: item,
                users,
                mentionTextClassName,
                emojiTextClassName,
                commonId,
                directParent,
                onUserClick,
              })}
            </React.Fragment>
          ))}
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
    case ElementType.Emoji:
      return (
        <ChatEmoji
          descendant={descendant}
          emojiTextClassName={emojiTextClassName}
        />
      );
    case ElementType.CheckboxItem:
      return (
        <CheckboxItem checked={descendant.checked}>
          {descendant.children.map((item, index) => (
            <React.Fragment key={index}>
              {getTextFromDescendant({
                descendant: item,
                users,
                mentionTextClassName,
                emojiTextClassName,
                commonId,
                directParent,
                onUserClick,
              })}
            </React.Fragment>
          ))}
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
    textEditorString,
    users,
    mentionTextClassName,
    emojiTextClassName,
    commonId,
    systemMessage,
    directParent,
    onUserClick,
  } = data;

  if (systemMessage) {
    const systemMessageText = await getTextFromSystemMessage(data);

    if (systemMessageText) {
      return systemMessageText;
    }
  }

  const textEditorValue = parseStringToTextEditorValue(textEditorString);
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

  return textEditorValue.reduce<Text[]>(
    (acc, item, index) => [
      ...acc,
      <React.Fragment key={index}>
        {getTextFromDescendant({
          descendant: item,
          users: filteredUsers,
          mentionTextClassName,
          emojiTextClassName,
          commonId,
          directParent,
          onUserClick,
        })}
      </React.Fragment>,
    ],
    [],
  );
};
