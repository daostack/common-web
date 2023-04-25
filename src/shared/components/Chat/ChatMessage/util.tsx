import React from "react";
import { UserService } from "@/services";
import { CommonMemberWithUserInfo } from "@/shared/models";
import { ElementType } from "@/shared/ui-kit/TextEditor/constants";
import { ParagraphElement } from "@/shared/ui-kit/TextEditor/types";
import { parseTextEditorValueToString } from "@/shared/ui-kit/TextEditor/utils";
import styles from "./ChatMessage.module.scss";

export const getTextFromTextEditorString = async (
  textEditorString: string,
  commonMembers: CommonMemberWithUserInfo[],
) => {
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
              className={styles.mentionText}
            >{`@${fetchedUser.displayName} `}</span>
          ) : (
            ""
          );
        }

        return (
          <span
            className={styles.mentionText}
          >{`@${commonMember.user.displayName} `}</span>
        );
      }

      return (tag as ParagraphElement)?.text ?? "";
    }),
  );
};
