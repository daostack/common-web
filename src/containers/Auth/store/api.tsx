import firebase from "@/shared/utils/firebase";
import { User, Collection, } from "@/shared/models";
import Api from "../../../services/Api";
import { ApiEndpoint } from "../../../shared/constants";
import { UserCreationDto } from "../interface";

export async function createdUserApi(
  requestData: UserCreationDto
): Promise<User> {
  const { data } = await Api.post<User>(ApiEndpoint.CreateUser, requestData);

  return data;
}

export async function getUserData (userId: string) {
  const userSnapshot = await firebase
    .firestore()
    .collection(Collection.Users)
    .where("uid", "==", userId)
    .get();

  if (userSnapshot.docs.length) {
    const user: User = (userSnapshot.docs[0].data() as unknown) as User;
    return user;
  }

  return null;
}
