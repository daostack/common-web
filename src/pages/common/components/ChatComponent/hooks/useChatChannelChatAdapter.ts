import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ChatMessageToUserDiscussionMessageConverter } from "@/shared/converters";
import {
  useChatMessages,
  useMarkChatMessageAsSeen,
  useUserById,
} from "@/shared/hooks/useCases";
import { User, UserDiscussionMessage } from "@/shared/models";

interface Options {
  participants?: string[];
}

interface Return {
  chatMessagesData: Omit<ReturnType<typeof useChatMessages>, "data"> & {
    data: UserDiscussionMessage[];
  };
  markChatMessageItemAsSeen: ReturnType<
    typeof useMarkChatMessageAsSeen
  >["markChatMessageAsSeen"];
  chatUsers: User[];
  fetchChatUsers: () => void;
}

export const useChatChannelChatAdapter = (options: Options): Return => {
  const { participants = [] } = options;
  const chatMessagesData = useChatMessages();
  const { markChatMessageAsSeen } = useMarkChatMessageAsSeen();
  const { fetchUser: fetchDMUser, data: dmUser } = useUserById();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const dmUserId = participants.find((participant) => participant !== userId);
  const users = useMemo(() => (dmUser ? [dmUser] : []), [dmUser]);
  const messages = useMemo(
    () =>
      chatMessagesData.data.map((item) =>
        ChatMessageToUserDiscussionMessageConverter.toTargetEntity(item),
      ),
    [chatMessagesData.data],
  );

  const fetchChatUsers = useCallback(() => {
    if (dmUserId) {
      fetchDMUser(dmUserId);
    }
  }, [fetchDMUser, dmUserId]);

  return {
    chatMessagesData: {
      ...chatMessagesData,
      data: messages,
    },
    markChatMessageItemAsSeen: markChatMessageAsSeen,
    chatUsers: users,
    fetchChatUsers,
  };
};
