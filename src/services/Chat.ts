import { ApiEndpoint } from "@/shared/constants";
import { DMUser, UnsubscribeFunction } from "@/shared/interfaces";
import { SendChatMessageDto } from "@/shared/interfaces/api";
import {
  ChatChannel,
  ChatMessage,
  ChatMessageUserStatus,
  Collection,
  SubCollections,
} from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  firestoreDataConverter,
  getUserName,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import Api from "./Api";

const chatChannelConverter = firestoreDataConverter<ChatChannel>();
const chatMessageUserStatusConverter =
  firestoreDataConverter<ChatMessageUserStatus>();

class ChatService {
  private getChatChannelCollection = () =>
    firebase
      .firestore()
      .collection(Collection.ChatChannel)
      .withConverter(chatChannelConverter);

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
