import React from "react";
import classNames from "classnames";
import { Descendant, Element } from "slate";
import { UserService } from "@/services";
import { useModal } from "@/shared/hooks";
import { User } from "@/shared/models";
import {
  getMentionTags,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit/TextEditor";
import { ElementType } from "@/shared/ui-kit/TextEditor/constants";
import { MentionElement, EmojiElement } from "@/shared/ui-kit/TextEditor/types";
import { getUserName } from "@/shared/utils";
import { UserInfoPopup } from "../../UserInfoPopup";
import styles from "./ChatMessage.module.scss";

interface UserMention {
  users: User[];
  descendant: MentionElement;
  mentionTextClassName?: string;
  commonId?: string;
}

const UserMention = ({
  users,
  descendant,
  mentionTextClassName,
  commonId,
}: UserMention) => {
  const {
    isShowing: isShowingUserProfile,
    onClose: onCloseUserProfile,
    onOpen: onOpenUserProfile,
  } = useModal(false);

  const user = users.find(({ uid }) => uid === descendant.userId);
  const withSpace =
    descendant.displayName[descendant.displayName.length - 1] === " ";
  const userName = user
    ? `${getUserName(user)}${withSpace ? " " : ""}`
    : descendant.displayName;

  return (
    <>
      <span
        className={classNames(styles.mentionText, mentionTextClassName)}
        onClick={onOpenUserProfile}
      >
        @{userName}
      </span>
      <UserInfoPopup
        avatar={user?.photoURL}
        isShowing={isShowingUserProfile}
        onClose={onCloseUserProfile}
        commonId={commonId}
        userId={user?.uid}
      />
    </>
  );
};

interface ChatEmoji {
  descendant: EmojiElement;
  emojiTextClassName?: string;
}

const ChatEmoji = ({ descendant, emojiTextClassName }: ChatEmoji) => {
  return <span className={emojiTextClassName}>{descendant.emoji}</span>;
};

type Text = string | JSX.Element;

interface TextFromDescendant {
  descendant: Descendant;
  users: User[];
  mentionTextClassName?: string;
  emojiTextClassName?: string;
  commonId?: string;
}

const getTextFromDescendant = ({
  descendant,
  users,
  mentionTextClassName,
  emojiTextClassName,
  commonId,
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
              })}
            </React.Fragment>
          ))}
          <br />
        </span>
      );
    case ElementType.Mention:
      return (
        <UserMention
          descendant={descendant}
          users={users}
          mentionTextClassName={mentionTextClassName}
          commonId={commonId}
        />
      );
    case ElementType.Emoji:
      return (
        <ChatEmoji
          descendant={descendant}
          emojiTextClassName={emojiTextClassName}
        />
      );
    default:
      return descendant.text || "";
  }
};

export const getTextFromTextEditorString = async ({
  textEditorString,
  users,
  mentionTextClassName,
  emojiTextClassName,
  commonId,
}: {
  textEditorString: string;
  users: User[];
  mentionTextClassName?: string;
  emojiTextClassName?: string;
  commonId?: string;
}): Promise<Text[]> => {
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
        })}
      </React.Fragment>,
    ],
    [],
  );
};
