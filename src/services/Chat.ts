import { ApiEndpoint, FirestoreDataSource } from "@/shared/constants";
import { DMUser, UnsubscribeFunction } from "@/shared/interfaces";
import {
  CreateChatMessageReaction,
  DeleteChatMessageReaction,
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
  UserReaction,
} from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  firestoreDataConverter,
  getUserName,
} from "@/shared/utils";
import firebase, { isFirestoreCacheError } from "@/shared/utils/firebase";
import Api, { CancelToken } from "./Api";

const chatChannelConverter = firestoreDataConverter<ChatChannel>();
const chatMessagesConverter = firestoreDataConverter<ChatMessage>();
const chatChannelUserStatusConverter =
  firestoreDataConverter<ChatChannelUserStatus>();
const getUserReactionConverter = firestoreDataConverter<UserReaction>();

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
    dmUserIds: string[],
    source = FirestoreDataSource.Default,
  ): Promise<ChatChannel | null> => {
    // This is for the case when we fetch chat channel for current user with himself
    if (currentUserId === dmUserIds[0] && dmUserIds.length === 1) {
      return this.getUserOwnChatChannel(currentUserId);
    }

    const snapshot = await this.getChatChannelCollection()
      .where("participants", "array-contains", currentUserId)
      .get({ source });
    const docSnapshot = snapshot.docs.find((doc) => {
      const { participants } = doc.data();

      // dmUserIds - never includes the current user.
      // participants - includes the current user.

      if (dmUserIds.length === 1) {
        // Regular 1 on 1 chat
        return participants.length === 2 && participants.includes(dmUserIds[0]);
      } else if (dmUserIds.length > 1) {
        // Group chat
        return (
          participants.length === dmUserIds.length + 1 &&
          dmUserIds.every((participant) => participants.includes(participant))
        );
      }
    });

    if (!docSnapshot) {
      return source === FirestoreDataSource.Cache
        ? this.getDMUserChatChannel(
            currentUserId,
            dmUserIds,
            FirestoreDataSource.Server,
          )
        : null;
    }

    return docSnapshot.data();
  };

  public getChatMessages = async (options: {
    chatChannelId: string;
    startAfter?: Timestamp | null;
    limit?: number | null;
    sortingDirection?: firebase.firestore.OrderByDirection;
  }): Promise<{
    chatMessages: ChatMessage[];
    firstDocTimestamp: Timestamp | null;
    lastDocTimestamp: Timestamp | null;
    hasMore: boolean;
  }> => {
    const {
      chatChannelId,
      startAfter,
      limit = 10,
      sortingDirection = "desc",
    } = options;
    let query = this.getChatMessagesSubCollection(chatChannelId).orderBy(
      "createdAt",
      sortingDirection,
    );

    if (startAfter) {
      query = query.startAfter(startAfter);
    }
    if (limit !== null) {
      query = query.limit(limit);
    }

    const snapshot = await query.get();
    const chatMessages = snapshot.docs.map((doc) => doc.data());
    const firstDocTimestamp = chatMessages[0]?.updatedAt || null;
    const lastDocTimestamp =
      chatMessages[chatMessages.length - 1]?.updatedAt || null;

    return {
      chatMessages,
      firstDocTimestamp,
      lastDocTimestamp,
      hasMore: Boolean(limit && chatMessages.length === limit),
    };
  };

  public getChatMessagesByChannelId = async (
    chatChannelId: string,
  ): Promise<ChatMessage[]> => {
    const messages: ChatMessage[] = [];
    let hasMore = true;
    let startAfter: Timestamp | null = null;

    while (hasMore) {
      const data = await this.getChatMessages({
        chatChannelId,
        startAfter,
        limit: null,
      });
      messages.push(...data.chatMessages);
      hasMore = data.hasMore;
      startAfter = data.lastDocTimestamp;
    }

    return messages.reverse();
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

  public createMessageReaction = async (
    payload: CreateChatMessageReaction,
  ): Promise<void> => {
    await Api.post(ApiEndpoint.CreateChatMessageReaction, payload);
  };

  public deleteMessageReaction = async (
    payload: DeleteChatMessageReaction,
  ): Promise<void> => {
    await Api.post(ApiEndpoint.DeleteChatMessageReaction, payload);
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

  public getChatChannelById = async (
    chatChannelId: string,
    source = FirestoreDataSource.Default,
  ): Promise<ChatChannel | null> => {
    try {
      const snapshot = await this.getChatChannelCollection()
        .doc(chatChannelId)
        .get({ source });

      return snapshot?.data() || null;
    } catch (error) {
      if (
        source === FirestoreDataSource.Cache &&
        isFirestoreCacheError(error)
      ) {
        return this.getChatChannelById(
          chatChannelId,
          FirestoreDataSource.Server,
        );
      }

      throw error;
    }
  };

  public getChatChannels = async (options: {
    participantId: string;
    startAt?: Timestamp;
    endAt?: Timestamp;
    onlyWithMessages?: boolean;
  }): Promise<ChatChannel[]> => {
    const { participantId, startAt, endAt, onlyWithMessages = false } = options;
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
    const chatChannels = snapshot.docs.map((doc) => doc.data());

    if (!onlyWithMessages) {
      return chatChannels;
    }

    return chatChannels.filter((chatChannel) => chatChannel.messageCount > 0);
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

  public getDMUserReaction = async (
    chatMessageId: string,
    chatChannelId: string,
    userId: string,
  ): Promise<UserReaction | null> =>
    (
      await firebase
        .firestore()
        .collection(Collection.ChatChannel)
        .doc(chatChannelId)
        .collection(SubCollections.ChatMessages)
        .doc(chatMessageId)
        .collection(Collection.Reactions)
        .withConverter(getUserReactionConverter)
        .doc(userId)
        .get()
    ).data() || null;
}

export default new ChatService();
