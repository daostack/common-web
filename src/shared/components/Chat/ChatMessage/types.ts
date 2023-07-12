import { SystemDiscussionMessage, User } from "@/shared/models";
import { GetCommonPageAboutTabPath, GetCommonPagePath } from "@/shared/utils";

export type Text = string | JSX.Element;

export interface TextData {
  textEditorString: string;
  users: User[];
  mentionTextClassName?: string;
  emojiTextClassName?: string;
  commonId?: string;
  systemMessage?: Pick<
    SystemDiscussionMessage,
    "systemMessageType" | "systemMessageData"
  >;
  getCommonPagePath?: GetCommonPagePath;
  getCommonPageAboutTabPath?: GetCommonPageAboutTabPath;
}
