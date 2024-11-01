import { DirectParent, SystemDiscussionMessage, User } from "@/shared/models";
import { TextEditorValue } from "@/shared/ui-kit";
import { GetCommonPageAboutTabPath, GetCommonPagePath } from "@/shared/utils";
import { InternalLinkData } from "@/shared/utils";

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
  onStreamMentionClick?: (feedItemId: string) => void;
  onFeedItemClick?: (feedItemId: string) => void;
  onMessageUpdate?: (message: TextEditorValue) => void;
  onInternalLinkClick?: (data: InternalLinkData) => void;
  showPlainText?: boolean;
}
