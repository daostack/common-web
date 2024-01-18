import { DirectParent, SystemDiscussionMessage, User } from "@/shared/models";
import { GetCommonPageAboutTabPath, GetCommonPagePath } from "@/shared/utils";

export type Text = string | JSX.Element;

export interface TextData {
  userId?: string;
  ownerId?: string | null;
  textEditorString: string;
  users: User[];
  mentionTextClassName?: string;
  emojiTextClassName?: string;
  commonId?: string;
  systemMessage?: SystemDiscussionMessage;
  getCommonPagePath?: GetCommonPagePath;
  getCommonPageAboutTabPath?: GetCommonPageAboutTabPath;
  directParent?: DirectParent | null;
  onUserClick?: (userId: string) => void;
  onFeedItemClick?: (feedItemId: string) => void;
}
