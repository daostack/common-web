import { ApiEndpoint } from "@/shared/constants";
import { DMUser } from "@/shared/interfaces";
import { getUserName } from "@/shared/utils";
import Api from "./Api";

class ChatService {
  public getDMUsers = async (): Promise<DMUser[]> => {
    const { data } = await Api.get<Omit<DMUser, "userName">[]>(
      ApiEndpoint.GetDMUsers,
    );

    return data.map((item) => ({
      ...item,
      userName: getUserName(item),
    }));
  };
}

export default new ChatService();
