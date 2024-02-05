import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import { InternalLinkData } from "@/shared/utils";
import {
  useDiscussionMessagesById,
  useMarkFeedItemAsSeen,
} from "@/shared/hooks/useCases";
import { TextStyles } from "@/shared/hooks/useCases/useDiscussionMessagesById";
import { DirectParent, User } from "@/shared/models";

interface Options {
  hasPermissionToHide: boolean;
  onUserClick?: (userId: string) => void;
  onFeedItemClick?: (feedItemId: string) => void;
  onInternalLinkClick?: (data: InternalLinkData) => void;
  directParent?: DirectParent | null;
  textStyles: TextStyles;
  discussionId: string;
}

interface Return {
  discussionMessagesData: ReturnType<typeof useDiscussionMessagesById>;
  markDiscussionMessageItemAsSeen: ReturnType<
    typeof useMarkFeedItemAsSeen
  >["markFeedItemAsSeen"];
  discussionUsers: User[];
  fetchDiscussionUsers: (commonId: string, circleVisibility?: string[]) => void;
}

export const useDiscussionChatAdapter = (options: Options): Return => {
  const {
    hasPermissionToHide,
    textStyles,
    discussionId,
    onFeedItemClick,
    onUserClick,
    onInternalLinkClick,
  } = options;
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const { data: commonMembers, fetchCommonMembers } = useCommonMembers();

  const allUsers = useMemo(
    () => commonMembers.map(({ user }) => user),
    [commonMembers],
  );

  const discussionUsers = useMemo(
    () => allUsers.filter((user) => user.uid !== userId),
    [userId, allUsers],
  );
  const discussionMessagesData = useDiscussionMessagesById({
    discussionId,
    hasPermissionToHide,
    users: allUsers,
    textStyles,
    onFeedItemClick,
    onUserClick,
    onInternalLinkClick,
  });
  const { markFeedItemAsSeen } = useMarkFeedItemAsSeen();

  const fetchDiscussionUsers = useCallback(
    (commonId: string, circleVisibility?: string[]) => {
      fetchCommonMembers(commonId, circleVisibility, false);
    },
    [fetchCommonMembers],
  );

  return {
    discussionMessagesData,
    markDiscussionMessageItemAsSeen: markFeedItemAsSeen,
    discussionUsers,
    fetchDiscussionUsers,
  };
};
