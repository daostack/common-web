import { isEqual } from "lodash";
import { getCommonState } from "@/pages/OldCommon/store/actions";
import { commonMembersSubCollection } from "@/pages/OldCommon/store/api";
import { store } from "@/shared/appConfig";
import { ApiEndpoint, GovernanceActions } from "@/shared/constants";
import { UnsubscribeFunction } from "@/shared/interfaces";
import {
  Collection,
  Common,
  CommonMember,
  CommonState,
  SubCollections,
} from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  firestoreDataConverter,
  transformFirebaseDataList,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import Api, { CancelToken } from "./Api";
import { waitForCommonToBeLoaded } from "./utils";

const converter = firestoreDataConverter<Common>();
const commonMemberConverter = firestoreDataConverter<CommonMember>();

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

  public getCachedCommonById = async (
    commonId: string,
  ): Promise<Common | null> => {
    const commonState = store.getState().commons.commonStates[commonId];

    if (commonState?.fetched) {
      return commonState.data;
    }
    if (commonState?.loading) {
      return await waitForCommonToBeLoaded(commonId);
    }

    store.dispatch(
      getCommonState.request({
        payload: { commonId },
      }),
    );

    return await waitForCommonToBeLoaded(commonId);
  };

  public getCommonsByIds = async (
    ids: string[],
    extendInitialQuery?: (
      query: firebase.firestore.Query,
    ) => firebase.firestore.Query,
  ): Promise<Common[]> => {
    if (ids.length === 0) {
      return [];
    }

    const queries: firebase.firestore.Query[] = [];
    const initialConfig = firebase
      .firestore()
      .collection(Collection.Daos)
      .where("state", "==", CommonState.ACTIVE);
    const config = extendInitialQuery
      ? extendInitialQuery(initialConfig)
      : initialConfig;

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
    const config = firebase
      .firestore()
      .collection(Collection.Daos)
      .where("state", "==", CommonState.ACTIVE);

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

  public getAllUserCommonMemberInfo = async (
    userId: string,
  ): Promise<(CommonMember & { commonId: string })[]> => {
    const snapshot = await firebase
      .firestore()
      .collectionGroup(SubCollections.Members)
      .where("userId", "==", userId)
      .withConverter(commonMemberConverter)
      .get();

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      commonId: doc.ref.path.split("/")[1],
    }));
  };

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

  public getParentCommonsByIds = async (ids: string[]): Promise<Common[]> =>
    this.getCommonsByIds(ids, (query) =>
      query.where("directParent", "==", null),
    );

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

  public subscribeToCircleMemberCountByCircleIds = (
    commonId: string,
    circleIds: string[],
    callback: (circleMembersCount: Map<string, number>) => void,
  ): UnsubscribeFunction => {
    const query = commonMembersSubCollection(commonId).withConverter(
      commonMemberConverter,
    );

    return query.onSnapshot((snapshot) => {
      const data = transformFirebaseDataList<CommonMember>(snapshot);
      const circleMembersCount = new Map<string, number>();
      circleIds.map((id, index) => {
        const filteredMembers = data.filter(({ circleIds: ids }) =>
          isEqual(
            ids.filter((id) => circleIds.includes(id)).sort(),
            circleIds.slice(0, index + 1).sort(),
          ),
        );

        circleMembersCount.set(id, filteredMembers?.length ?? 0);
      });
      callback(circleMembersCount);
    });
  };

  public subscribeToCommon = (
    commonId: string,
    callback: (common: Common, isRemoved: boolean) => void,
  ): UnsubscribeFunction => {
    const query = firebase
      .firestore()
      .collection(Collection.Daos)
      .where("id", "==", commonId)
      .where("state", "==", CommonState.ACTIVE)
      .withConverter(converter);

    return query.onSnapshot((snapshot) => {
      const docChange = snapshot.docChanges()[0];

      if (docChange && docChange.type !== "added") {
        callback(docChange.doc.data(), docChange.type === "removed");
      }
    });
  };

  public subscribeToCommons = (
    commonIds: string[],
    callback: (data: { common: Common; isRemoved: boolean }[]) => void,
  ): UnsubscribeFunction => {
    const query = firebase
      .firestore()
      .collection(Collection.Daos)
      .where("id", "in", commonIds)
      .where("state", "==", CommonState.ACTIVE)
      .withConverter(converter);

    return query.onSnapshot((snapshot) => {
      const data = snapshot.docChanges().map((docChange) => ({
        common: docChange.doc.data(),
        isRemoved: docChange.type === "removed",
      }));
      callback(data);
    });
  };

  public subscribeToSubCommons = (
    parentCommonId: string,
    callback: (data: { common: Common; isRemoved: boolean }[]) => void,
  ): UnsubscribeFunction => {
    const query = firebase
      .firestore()
      .collection(Collection.Daos)
      .where("state", "==", CommonState.ACTIVE)
      .where("directParent.commonId", "==", parentCommonId)
      .withConverter(converter);

    return query.onSnapshot((snapshot) => {
      const data = snapshot.docChanges().map((docChange) => ({
        common: docChange.doc.data(),
        isRemoved: docChange.type === "removed",
      }));
      callback(data);
    });
  };

  public subscribeToCommonMemberByCommonIdAndUserId = (
    commonId: string,
    userId: string,
    callback: (
      commonMember: CommonMember,
      statuses: {
        isAdded: boolean;
        isRemoved: boolean;
      },
    ) => void,
  ): UnsubscribeFunction => {
    const query = commonMembersSubCollection(commonId)
      .where("userId", "==", userId)
      .withConverter(commonMemberConverter);

    return query.onSnapshot((snapshot) => {
      const docChange = snapshot.docChanges()[0];

      if (docChange) {
        callback(docChange.doc.data(), {
          isAdded: docChange.type === "added",
          isRemoved: docChange.type === "removed",
        });
      }
    });
  };

  public getCommonMembersAmount = async (commonId: string): Promise<number> => {
    const snapshot = await commonMembersSubCollection(commonId).get();

    return snapshot.size;
  };

  public leaveCircle = async (
    commonId: string,
    circleId: string,
  ): Promise<void> => {
    await Api.post(ApiEndpoint.CreateAction, {
      type: GovernanceActions.LEAVE_CIRCLE,
      args: { commonId, circleId },
    });
  };

  public acceptRules = async (
    commonId: string,
    options: { cancelToken?: CancelToken } = {},
  ): Promise<void> => {
    const { cancelToken } = options;
    await Api.post(ApiEndpoint.AcceptRules, { commonId }, { cancelToken });
  };

  public inviteToCircle = async (
    commonId: string,
    circleId: string,
    inviteeId: string,
  ): Promise<void> => {
    await Api.post(ApiEndpoint.CreateAction, {
      type: GovernanceActions.INVITE_TO_CIRCLE,
      args: { commonId, circleId, inviteeId },
    });
  };
}

export default new CommonService();
