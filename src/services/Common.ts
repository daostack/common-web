import {
  Collection,
  Common,
  CommonMember,
  CommonState,
  SubCollections,
} from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  transformFirebaseDataList,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import { commonMembersSubCollection } from "../pages/OldCommon/store/api";

class CommonService {
  public getCommonById = async (commonId: string): Promise<Common | null> => {
    const common = await firebase
      .firestore()
      .collection(Collection.Daos)
      .where("id", "==", commonId)
      .where("state", "==", CommonState.ACTIVE)
      .get();
    const data = transformFirebaseDataList<Common>(common);

    return data[0] ? convertObjectDatesToFirestoreTimestamps(data[0]) : null;
  };

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

  // Fetch all parent commons. Order: from main parent common to lowest ones
  public getAllParentCommonsForCommon = async (
    commonToCheck: Pick<Common, "directParent"> | string,
  ): Promise<Common[]> => {
    const common =
      typeof commonToCheck === "string"
        ? await this.getCommonById(commonToCheck)
        : commonToCheck;

    if (!common || common.directParent === null) {
      return [];
    }

    let finalCommons: Common[] = [];
    let nextCommonId = common.directParent.commonId;

    while (nextCommonId) {
      const common = await this.getCommonById(nextCommonId);

      if (common) {
        finalCommons = [common, ...finalCommons];
      }

      nextCommonId = common?.directParent?.commonId || "";
    }

    return finalCommons;
  };

  public getParentCommonForCommonId = async (
    commonId: string,
  ): Promise<Common | null> => {
    let nextCommonId = commonId;

    while (nextCommonId) {
      const common = await this.getCommonById(nextCommonId);

      if (common && !common.directParent) {
        return common;
      }

      nextCommonId = common?.directParent?.commonId || "";
    }

    return null;
  };

  public getCommonMemberByUserId = async (
    commonId: string,
    userId: string,
  ): Promise<CommonMember | null> => {
    const result = await commonMembersSubCollection(commonId)
      .where("userId", "==", userId)
      .get();
    const members = transformFirebaseDataList<CommonMember>(result);

    return members[0] || null;
  };

  public fetchCircleMemberCountByCircleId = async ({
    commonId,
    circleId,
  }: {
    commonId: string;
    circleId: string;
  }): Promise<number> => {
    const commonMembersData = await firebase
      .firestore()
      .collection(Collection.Daos)
      .doc(commonId)
      .collection(SubCollections.Members)
      .where("circleIds", "array-contains", circleId)
      .get();
    const data = transformFirebaseDataList<CommonMember>(commonMembersData);
  
    return data?.length ?? 0;
  }
}

export default new CommonService();
