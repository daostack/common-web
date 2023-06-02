import { stringify } from "query-string";
import { ApiEndpoint } from "@/shared/constants";
import { DMUser, UnsubscribeFunction } from "@/shared/interfaces";
import {
  GetChatChannelMessagesResponse,
  SendChatMessageDto,
} from "@/shared/interfaces/api";
import {
  ChatChannel,
  ChatMessage,
  ChatMessageUserStatus,
  Collection,
  SubCollections,
  Timestamp,
} from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  convertToTimestamp,
  firestoreDataConverter,
  getUserName,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import Api, { CancelToken } from "./Api";

const chatChannelConverter = firestoreDataConverter<ChatChannel>();
const chatMessagesConverter = firestoreDataConverter<ChatMessage>();
const chatMessageUserStatusConverter =
  firestoreDataConverter<ChatMessageUserStatus>();

class ChatService {
  private getChatChannelCollection = () =>
    firebase
      .firestore()
      .collection(Collection.ChatChannel)
      .withConverter(chatChannelConverter);

  private getChatMessagesSubCollection = (chatChannelId: string) =>
    this.getChatChannelCollection()
      .doc(chatChannelId)
      .collection(SubCollections.ChatMessages)
      .withConverter(chatMessagesConverter);

  private getChatMessageUserStatusSubCollection = (chatChannelId: string) =>
    this.getChatChannelCollection()
      .doc(chatChannelId)
      .collection(SubCollections.ChatMessagesUserUnique)
      .withConverter(chatMessageUserStatusConverter);

  public getDMUsers = async (): Promise<DMUser[]> => {
    const { data } = await Api.get<{ data: Omit<DMUser, "userName">[] }>(
      ApiEndpoint.GetDMUsers,
    );

    return data.data.map((item) => ({
      ...item,
      userName: getUserName(item),
    }));
  };

  public getDMUserChatChannel = async (
    currentUserId: string,
    dmUserId: string,
  ): Promise<ChatChannel | null> => {
    const snapshot = await this.getChatChannelCollection()
      .where("participants", "array-contains", currentUserId)
      .get();
    const docSnapshot = snapshot.docs.find((doc) => {
      const { participants } = doc.data();

      return participants.length === 2 && participants.includes(dmUserId);
    });

    if (!docSnapshot) {
      return null;
    }

    return docSnapshot.data();
  };

  public getChatMessages = async (
    chatChannelId: string,
    options: { cancelToken?: CancelToken } = {},
  ): Promise<ChatMessage[]> => {
    const { cancelToken } = options;
    const messages: ChatMessage[] = [];
    let hasMore = true;
    let startAfter: Timestamp | null = null;

    while (hasMore) {
      const queryParams: Record<string, unknown> = { limit: 50 };

      if (startAfter) {
        queryParams.startAfter = startAfter.toDate().toISOString();
      }

      const { data } = await Api.get<GetChatChannelMessagesResponse>(
        `${ApiEndpoint.GetChatChannelMessages(chatChannelId)}?${stringify(
          queryParams,
        )}`,
        { cancelToken },
      );
      messages.push(...data.chatMessages);
      hasMore = data.hasMore;
      startAfter =
        (data.lastDocTimestamp && convertToTimestamp(data.lastDocTimestamp)) ||
        null;
    }

    return messages
      .reverse()
      .map((message) => convertObjectDatesToFirestoreTimestamps(message));
  };

  public createChatChannel = async (
    participants: string[],
  ): Promise<ChatChannel> => {
    const { data } = await Api.post<ChatChannel>(
      ApiEndpoint.CreateChatChannel,
      {
        participants,
      },
    );

    return convertObjectDatesToFirestoreTimestamps(data);
  };

  public sendChatMessage = async (
    payload: SendChatMessageDto,
  ): Promise<ChatMessage> => {
    const { chatChannelId, ...body } = payload;
    const { data } = await Api.post<ChatMessage>(
      ApiEndpoint.SendChatMessage(chatChannelId),
      body,
    );

    return data;
  };

  public markChatMessageAsSeen = async (
    chatMessageId: string,
    options: { cancelToken?: CancelToken } = {},
  ): Promise<void> => {
    const { cancelToken } = options;
    await Api.post(
      ApiEndpoint.MarkChatMessageAsSeen(chatMessageId),
      undefined,
      { cancelToken },
    );
  };

  public subscribeToChatChannelMessages = (
    chatChannelId: string,
    callback: (messages: ChatMessage[]) => void,
  ): UnsubscribeFunction =>
    this.getChatMessagesSubCollection(chatChannelId).onSnapshot((snapshot) => {
      const messages = snapshot.docs
        .map((doc) => doc.data())
        .sort(
          (prevMessage: ChatMessage, nextMessage: ChatMessage) =>
            prevMessage.createdAt.seconds - nextMessage.createdAt.seconds,
        );
      callback(messages);
    });

  public subscribeToChatMessageUserStatus = (
    userId: string,
    chatChannelId: string,
    callback: (data: ChatMessageUserStatus) => void,
  ): UnsubscribeFunction => {
    const query = this.getChatMessageUserStatusSubCollection(chatChannelId)
      .where("chatChannelId", "==", chatChannelId)
      .where("userId", "==", userId);

    return query.onSnapshot((snapshot) => {
      const data = snapshot.docChanges()[0]?.doc.data();

      if (data) {
        callback(data);
      }
    });
  };
}

export default new ChatService();
