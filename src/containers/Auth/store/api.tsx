import { User } from "../../../shared/models";
import Api from "../../../services/Api";
import { ApiEndpoint } from "../../../shared/constants";
import { UserCreationDto } from "../interface";

export async function createdUserApi(
  requestData: UserCreationDto
): Promise<User> {
  const { data } = await Api.post<User>(ApiEndpoint.CreateUser, requestData);

  return data;
}
