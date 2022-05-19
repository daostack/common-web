import firebase from "@/shared/utils/firebase";
import { User, Collection } from "@/shared/models";
import { transformFirebaseDataList } from "@/shared/utils";
import Api from "../../../services/Api";
import { ApiEndpoint } from "../../../shared/constants";
import { UserCreationDto } from "../interface";

export async function createdUserApi(
  requestData: UserCreationDto
): Promise<User> {
  const { data } = await Api.post<User>(ApiEndpoint.CreateUser, requestData);

  return data;
}

export async function getUserData(userId: string) {
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

export async function getUserListByIds(ids: string[]): Promise<User[]> {
  if (ids.length === 0) {
    return [];
  }

  const queries: firebase.firestore.Query[] = [];
  const config = firebase.firestore().collection(Collection.Users);

  // Firebase allows to use at most 10 items per query for `in` option
  for (let i = 0; i < ids.length; i += 10) {
    queries.push(config.where("uid", "in", ids.slice(i, i + 10)));
  }
  const results = await Promise.all(queries.map((query) => query.get()));

  return results
    .map((result) => transformFirebaseDataList<User>(result))
    .reduce((acc, items) => [...acc, ...items], []);
}
