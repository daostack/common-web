import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import {
  useDiscussionMessagesById,
  useMarkFeedItemAsSeen,
} from "@/shared/hooks/useCases";
import { User } from "@/shared/models";

interface Options {
  hasPermissionToHide: boolean;
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
  const { hasPermissionToHide } = options;
  const discussionMessagesData = useDiscussionMessagesById({
    hasPermissionToHide,
  });
  const { markFeedItemAsSeen } = useMarkFeedItemAsSeen();
  const { data: commonMembers, fetchCommonMembers } = useCommonMembers();
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const users = useMemo(
    () =>
      commonMembers
        .filter((member) => member.userId !== userId)
        .map(({ user }) => user),
    [userId, commonMembers],
  );

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
