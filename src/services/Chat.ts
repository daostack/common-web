import { ApiEndpoint } from "@/shared/constants";
import { DMUser } from "@/shared/interfaces";
import { SendChatMessageDto } from "@/shared/interfaces/api";
import { ChatChannel, ChatMessage } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import Api from "./Api";

class ChatService {
  public getDMUsers = async (): Promise<DMUser[]> => {
    const { data } = await Api.get<{ data: Omit<DMUser, "userName">[] }>(
      ApiEndpoint.GetDMUsers,
    );

    return data.data.map((item) => ({
      ...item,
      userName: getUserName(item),
    }));
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

    return data;
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
}

export default new ChatService();
