import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ChatMessageToUserDiscussionMessageConverter } from "@/shared/converters";
import {
  useChatMessages,
  useMarkChatMessageAsSeen,
  useUpdateChatChannelSeenState,
  useUsersByIds,
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
  markChatChannelAsSeen: (
    id: string,
    delay?: number,
  ) => ReturnType<typeof setTimeout>;
  chatUsers: User[];
  fetchChatUsers: () => void;
}

export const useChatChannelChatAdapter = (options: Options): Return => {
  const { participants = [] } = options;
  const chatMessagesData = useChatMessages();
  const { markChatMessageAsSeen } = useMarkChatMessageAsSeen();
  const { markChatChannelAsSeen } = useUpdateChatChannelSeenState();
  const { fetchUsers: fetchDMUsers, data: dmUsers } = useUsersByIds();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const users = useMemo(() => dmUsers ?? [], [dmUsers]);
  const messages = useMemo(
    () =>
      chatMessagesData.data.map((item) =>
        ChatMessageToUserDiscussionMessageConverter.toTargetEntity(item),
      ),
    [chatMessagesData.data],
  );

  const fetchChatUsers = useCallback(() => {
    if (participants) {
      fetchDMUsers(participants.filter((uid) => uid !== userId));
    }
  }, [fetchDMUsers, participants]);

  return {
    chatMessagesData: {
      ...chatMessagesData,
      data: messages,
    },
    markChatMessageItemAsSeen: markChatMessageAsSeen,
    markChatChannelAsSeen,
    chatUsers: users,
    fetchChatUsers,
  };
};
