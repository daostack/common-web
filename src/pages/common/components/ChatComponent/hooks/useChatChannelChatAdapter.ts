import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  useChatMessages,
  useMarkChatMessageAsSeen,
  useUserById,
} from "@/shared/hooks/useCases";
import { User } from "@/shared/models";

interface Options {
  participants: string[];
}

interface Return {
  chatMessagesData: ReturnType<typeof useChatMessages>;
  markChatMessageItemAsSeen: ReturnType<
    typeof useMarkChatMessageAsSeen
  >["markChatMessageAsSeen"];
  chatUsers: User[];
  fetchChatUsers: () => void;
}

export const useChatChannelChatAdapter = (options: Options): Return => {
  const { participants } = options;
  const chatMessagesData = useChatMessages();
  const { markChatMessageAsSeen } = useMarkChatMessageAsSeen();
  const { fetchUser: fetchDMUser, data: dmUser } = useUserById();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const dmUserId = participants.find((participant) => participant !== userId);
  const users = useMemo(() => (dmUser ? [dmUser] : []), [dmUser]);

  const fetchChatUsers = useCallback(() => {
    if (dmUserId) {
      fetchDMUser(dmUserId);
    }
  }, [fetchDMUser, dmUserId]);

  return {
    chatMessagesData,
    markChatMessageItemAsSeen: markChatMessageAsSeen,
    chatUsers: users,
    fetchChatUsers,
  };
};
