import React from "react";
import classNames from "classnames";
import { UserService } from "@/services";
import { CommonMemberWithUserInfo } from "@/shared/models";
import { ElementType } from "@/shared/ui-kit/TextEditor/constants";
import { parseTextEditorValueToString } from "@/shared/ui-kit/TextEditor/utils";
import styles from "./ChatMessage.module.scss";

export const getTextFromTextEditorString = async ({
  textEditorString,
  commonMembers,
  mentionTextClassName,
}: {
  textEditorString: string;
  commonMembers: CommonMemberWithUserInfo[];
  mentionTextClassName?: string;
}) => {
  return await Promise.all(
    parseTextEditorValueToString(textEditorString)?.map(async (tag) => {
      if (tag.type === ElementType.Mention) {
        const commonMember = commonMembers.find(
          ({ user }) => user.uid === tag.userId,
        );

        if (!commonMember) {
          const fetchedUser = await UserService.getUserById(tag.userId);
          return fetchedUser ? (
            <span
              className={classNames(styles.mentionText, mentionTextClassName)}
            >{`@${fetchedUser.displayName} `}</span>
          ) : (
            ""
          );
        }

        return (
          <span
            className={classNames(styles.mentionText, mentionTextClassName)}
          >{`@${commonMember.user.displayName} `}</span>
        );
      } else if (tag.type === ElementType.Paragraph) {
        return `${tag.text ?? ""}\n`;
      }

      return tag?.text ?? "";
    }),
  );
};
