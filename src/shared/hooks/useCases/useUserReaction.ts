import { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ChatService, DiscussionMessageService, Logger } from "@/services";
import { UserReaction } from "@/shared/models";

interface Return {
  getUserReaction: (
    discussionMessageId: string,
  ) => Promise<UserReaction[] | null | undefined>;
  getDMUserReaction: (
    chatMessageId: string,
    chatChannelId: string,
  ) => Promise<UserReaction[] | null | undefined>;
}

interface Options {
  fetchAll?: boolean;
}

export const useUserReaction = ({ fetchAll }: Options): Return => {
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const getUserReaction = useCallback(
    async (discussionMessageId: string) => {
      try {
        return await DiscussionMessageService.getUsersReactions(
          discussionMessageId,
          userId,
          fetchAll,
        );
      } catch (error) {
        Logger.error(error);
      }
    },
    [userId],
  );

  const getDMUserReaction = useCallback(
    async (chatMessageId: string, chatChannelId: string) => {
      if (userId) {
        try {
          return await ChatService.getDMUserReaction(
            chatMessageId,
            chatChannelId,
            userId,
            fetchAll,
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
    getDMUserReaction,
  };
};
