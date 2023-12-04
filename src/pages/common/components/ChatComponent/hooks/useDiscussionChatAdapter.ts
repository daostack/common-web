import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
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
  } = options;
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const { data: commonMembers, fetchCommonMembers } = useCommonMembers();
  const users = useMemo(
    () =>
      commonMembers
        .filter((member) => member.userId !== userId)
        .map(({ user }) => user),
    [userId, commonMembers],
  );
  const discussionMessagesData = useDiscussionMessagesById({
    discussionId,
    hasPermissionToHide,
    users,
    textStyles,
    onFeedItemClick,
    onUserClick,
  });
  const { markFeedItemAsSeen } = useMarkFeedItemAsSeen();

  const fetchDiscussionUsers = useCallback(
    (commonId: string, circleVisibility?: string[]) => {
      fetchCommonMembers(commonId, circleVisibility, true);
    },
    [fetchCommonMembers],
  );

  return {
    discussionMessagesData,
    markDiscussionMessageItemAsSeen: markFeedItemAsSeen,
    discussionUsers: users,
    fetchDiscussionUsers,
  };
};
