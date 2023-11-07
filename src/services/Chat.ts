import { stringify } from "query-string";
import { ApiEndpoint } from "@/shared/constants";
import { DMUser, UnsubscribeFunction } from "@/shared/interfaces";
import {
  GetChatChannelMessagesResponse,
  SendChatMessageDto,
  UpdateChatMessageDto,
} from "@/shared/interfaces/api";
import {
  ChatChannel,
  ChatChannelUserStatus,
  ChatMessage,
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
const chatChannelUserStatusConverter =
  firestoreDataConverter<ChatChannelUserStatus>();

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

  private getChatChannelUserStatusSubCollection = (chatChannelId: string) =>
    this.getChatChannelCollection()
      .doc(chatChannelId)
      .collection(SubCollections.ChatChannelUserUnique)
      .withConverter(chatChannelUserStatusConverter);

  public getDMUsers = async (): Promise<DMUser[]> => {
    const { data } = await Api.get<{ data: Omit<DMUser, "userName">[] }>(
      ApiEndpoint.GetDMUsers,
    );

    return data.data.map((item) => ({
      ...item,
      userName: getUserName(item),
    }));
  };

  public getUserOwnChatChannel = async (
    userId: string,
  ): Promise<ChatChannel | null> => {
    const snapshot = await this.getChatChannelCollection()
      .where("participants", "array-contains", userId)
      .get();
    const docSnapshot = snapshot.docs.find((doc) => {
      const { participants } = doc.data();

      return participants.length === 1;
    });

    if (!docSnapshot) {
      return null;
    }

    return docSnapshot.data();
  };

  public getDMUserChatChannel = async (
    currentUserId: string,
    dmUserId: string,
  ): Promise<ChatChannel | null> => {
    if (currentUserId === dmUserId) {
      return this.getUserOwnChatChannel(currentUserId);
    }

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

      const {
        data: { data },
      } = await Api.get<GetChatChannelMessagesResponse>(
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
      .map((message) =>
        convertObjectDatesToFirestoreTimestamps(message, ["editedAt"]),
      );
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

    return convertObjectDatesToFirestoreTimestamps(data, ["editedAt"]);
  };

  public updateChatMessage = async (
    payload: UpdateChatMessageDto,
  ): Promise<Partial<ChatMessage>> => {
    const { chatMessageId, ...body } = payload;
    const { data } = await Api.patch<Partial<ChatMessage>>(
      ApiEndpoint.UpdateChatMessage(chatMessageId),
      body,
    );

    return convertObjectDatesToFirestoreTimestamps(data, ["editedAt"]);
  };

  public deleteChatMessage = async (chatMessageId: string): Promise<void> => {
    await Api.delete(ApiEndpoint.DeleteChatMessage(chatMessageId));
  };

  public markChatChannelAsSeen = async (
    chatChannelId: string,
    options: { cancelToken?: CancelToken } = {},
  ): Promise<void> => {
    const { cancelToken } = options;
    await Api.post(
      ApiEndpoint.MarkChatChannelAsSeen(chatChannelId),
      undefined,
      { cancelToken },
    );
  };

  public markChatChannelAsUnseen = async (
    chatChannelId: string,
    options: { cancelToken?: CancelToken } = {},
  ): Promise<void> => {
    const { cancelToken } = options;
    await Api.post(
      ApiEndpoint.MarkChatChannelAsUnseen(chatChannelId),
      undefined,
      { cancelToken },
    );
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

  public subscribeToChatChannel = (
    chatChannelId: string,
    participantId: string,
    callback: (chatChannel: ChatChannel, isRemoved: boolean) => void,
  ): UnsubscribeFunction => {
    const query = this.getChatChannelCollection()
      .where("id", "==", chatChannelId)
      .where("participants", "array-contains", participantId);

    return query.onSnapshot((snapshot) => {
      const docChange = snapshot.docChanges()[0];

      if (docChange && docChange.type !== "added") {
        callback(docChange.doc.data(), docChange.type === "removed");
      }
    });
  };

  public getChatChannels = async (options: {
    participantId: string;
    startAt?: Timestamp;
    endAt?: Timestamp;
  }): Promise<ChatChannel[]> => {
    const { participantId, startAt, endAt } = options;
    let query = this.getChatChannelCollection()
      .where("participants", "array-contains", participantId)
      .orderBy("updatedAt", "desc");

    if (startAt) {
      query = query.startAt(startAt);
    }
    if (endAt) {
      query = query.endAt(endAt);
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => doc.data());
  };

  public subscribeToNewUpdatedChatChannels = (
    participantId: string,
    endBefore: Timestamp,
    callback: (
      data: {
        chatChannel: ChatChannel;
        statuses: {
          isAdded: boolean;
          isRemoved: boolean;
        };
      }[],
    ) => void,
  ): UnsubscribeFunction => {
    const query = this.getChatChannelCollection()
      .where("participants", "array-contains", participantId)
      .orderBy("updatedAt", "desc")
      .endBefore(endBefore);

    return query.onSnapshot((snapshot) => {
      const data = snapshot.docChanges().map((docChange) => ({
        chatChannel: docChange.doc.data(),
        statuses: {
          isAdded: docChange.type === "added",
          isRemoved: docChange.type === "removed",
        },
      }));
      callback(data);
    });
  };

  public subscribeToChatChannelMessages = (
    chatChannelId: string,
    callback: (
      data: {
        message: ChatMessage;
        statuses: {
          isAdded: boolean;
          isRemoved: boolean;
        };
      }[],
    ) => void,
  ): UnsubscribeFunction =>
    this.getChatMessagesSubCollection(chatChannelId).onSnapshot((snapshot) => {
      const messages = snapshot
        .docChanges()
        .map((docChange) => ({
          message: docChange.doc.data(),
          statuses: {
            isAdded: docChange.type === "added",
            isRemoved: docChange.type === "removed",
          },
        }))
        .sort(
          (prevItem, nextItem) =>
            prevItem.message.createdAt.seconds -
            nextItem.message.createdAt.seconds,
        );
      callback(messages);
    });

  public subscribeToChatChannelUserStatus = (
    userId: string,
    chatChannelId: string,
    callback: (data: ChatChannelUserStatus | null) => void,
  ): UnsubscribeFunction => {
    const query = this.getChatChannelUserStatusSubCollection(chatChannelId)
      .where("chatChannelId", "==", chatChannelId)
      .where("userId", "==", userId);

    return query.onSnapshot((snapshot) => {
      const data = snapshot.docChanges()[0]?.doc.data();
      callback(data || null);
    });
  };
}

export default new ChatService();
