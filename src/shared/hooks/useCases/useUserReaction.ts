import { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { DiscussionMessageService, Logger } from "@/services";
import { UserReaction } from "@/shared/models";

interface Return {
  getUserReaction: (
    discussionMessageId: string,
  ) => Promise<UserReaction | null | undefined>;
}

export const useUserReaction = (): Return => {
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const getUserReaction = useCallback(
    async (discussionMessageId: string) => {
      if (userId) {
        try {
          return await DiscussionMessageService.getUserReaction(
            discussionMessageId,
            userId,
          );
        } catch (error) {
          Logger.error(error);
        }
      }
    },
    [userId],
  );

  return {
    getUserReaction,
  };
};
