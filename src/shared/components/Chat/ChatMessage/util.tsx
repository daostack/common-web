import React from "react";
import classNames from "classnames";
import { Descendant, Element } from "slate";
import { UserService } from "@/services";
import { CommonMemberWithUserInfo, User } from "@/shared/models";
import {
  getMentionTags,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit/TextEditor";
import { ElementType } from "@/shared/ui-kit/TextEditor/constants";
import { getUserName } from "@/shared/utils";
import styles from "./ChatMessage.module.scss";

type Text = string | JSX.Element;

const getTextFromDescendant = (
  descendant: Descendant,
  users: User[],
  mentionTextClassName?: string,
): Text => {
  if (!Element.isElement(descendant)) {
    return descendant.text || "";
  }

  switch (descendant.type) {
    case ElementType.Paragraph:
      return (
        <span>
          {descendant.children.map((item, index) => (
            <React.Fragment key={index}>
              {getTextFromDescendant(item, users, mentionTextClassName)}
            </React.Fragment>
          ))}
          <br />
        </span>
      );
    case ElementType.Mention:
      const user = users.find(({ uid }) => uid === descendant.userId);
      const withSpace =
        descendant.displayName[descendant.displayName.length - 1] === " ";
      const userName = user
        ? `${getUserName(user)}${withSpace ? " " : ""}`
        : descendant.displayName;

      return (
        <span className={classNames(styles.mentionText, mentionTextClassName)}>
          @{userName}
        </span>
      );
    default:
      return descendant.text || "";
  }
};

export const getTextFromTextEditorString = async ({
  textEditorString,
  users,
  mentionTextClassName,
}: {
  textEditorString: string;
  users: User[];
  mentionTextClassName?: string;
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
        {getTextFromDescendant(item, filteredUsers, mentionTextClassName)}
      </React.Fragment>,
    ],
    [],
  );
};
