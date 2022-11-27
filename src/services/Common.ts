import {
  Collection,
  Common,
  CommonState,
  SubCollections,
} from "@/shared/models";
import { transformFirebaseDataList } from "@/shared/utils";
import firebase from "@/shared/utils/firebase";

class CommonService {
  public getCommonsByIds = async (ids: string[]): Promise<Common[]> => {
    if (ids.length === 0) {
      return [];
    }

    const queries: firebase.firestore.Query[] = [];
    const config = firebase.firestore().collection(Collection.Daos);

    // Firebase allows to use at most 10 items per query for `in` option
    for (let i = 0; i < ids.length; i += 10) {
      queries.push(config.where("id", "in", ids.slice(i, i + 10)));
    }
    const results = await Promise.all(queries.map((query) => query.get()));

    return results
      .map((result) => transformFirebaseDataList<Common>(result))
      .reduce((acc, items) => [...acc, ...items], []);
  };

  public getCommonsByDirectParentIds = async (
    ids: string[],
  ): Promise<Common[]> => {
    if (ids.length === 0) {
      return [];
    }

    const queries: firebase.firestore.Query[] = [];
    const config = firebase.firestore().collection(Collection.Daos);

    // Firebase allows to use at most 10 items per query for `in` option
    for (let i = 0; i < ids.length; i += 10) {
      queries.push(
        config.where("directParent.commonId", "in", ids.slice(i, i + 10)),
      );
    }
    const results = await Promise.all(queries.map((query) => query.get()));

    return results
      .map((result) => transformFirebaseDataList<Common>(result))
      .reduce((acc, items) => [...acc, ...items], []);
  };

  public getUserCommonIds = async (userId: string): Promise<string[]> =>
    (
      await firebase
        .firestore()
        .collectionGroup(SubCollections.Members)
        .where("userId", "==", userId)
        .get()
    ).docs.map((ref) => ref.ref.path.split("/")[1]);

  public getCommonsWithSubCommons = async (
    commonIds: string[],
  ): Promise<Common[]> => {
    const parentCommons = (await this.getCommonsByIds(commonIds)).filter(
      (common) => common.directParent === null,
    );
    const finalCommons = [...parentCommons];
    let directParentIdsToUse = parentCommons.map((common) => common.id);

    while (directParentIdsToUse.length > 0) {
      const commons = await this.getCommonsByDirectParentIds(
        directParentIdsToUse,
      );
      finalCommons.push(...commons);
      directParentIdsToUse = commons.map((common) => common.id);
    }

    return finalCommons;
  };

  public getUserProjectsInfo = async (
    userId: string,
  ): Promise<{ common: Common; hasMembership: boolean }[]> => {
    const userCommonIds = await this.getUserCommonIds(userId);
    const commons = await this.getCommonsWithSubCommons(userCommonIds);

    return commons
      .filter((common) => common.state === CommonState.ACTIVE)
      .map((common) => ({
        common,
        hasMembership: userCommonIds.some((commonId) => commonId === common.id),
      }));
  };
}

export default new CommonService();
