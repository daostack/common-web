import { isEqual } from "lodash";
import {
  getCommonState,
  updateCommonState,
} from "@/pages/OldCommon/store/actions";
import { commonMembersSubCollection } from "@/pages/OldCommon/store/api";
import { store } from "@/shared/appConfig";
import {
  ApiEndpoint,
  DocChange,
  FirestoreDataSource,
  GovernanceActions,
  ProposalsTypes,
} from "@/shared/constants";
import { UnsubscribeFunction } from "@/shared/interfaces";
import {
  Collection,
  Common,
  CommonFlatTree,
  CommonMember,
  CommonState,
  SubCollections,
} from "@/shared/models";
import {
  emptyFunction,
  firestoreDataConverter,
  transformFirebaseDataList,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import Api, { CancelToken } from "./Api";
import { waitForCommonToBeLoaded } from "./utils";

const converter = firestoreDataConverter<Common>();
const commonMemberConverter = firestoreDataConverter<CommonMember>();
const commonFlatTreeConverter = firestoreDataConverter<CommonFlatTree>();

class CommonService {
  public getCommonById = async (
    commonId: string,
    cached = false,
    state = CommonState.ACTIVE,
  ): Promise<Common | null> => {
    const snapshot = await firebase
      .firestore()
      .collection(Collection.Daos)
      .where("id", "==", commonId)
      .where("state", "==", state)
      .withConverter(converter)
      .get({ source: cached ? "cache" : "default" });
    const commons = snapshot.docs.map((doc) => doc.data());
    const common = commons[0] || null;

    if (cached && !common) {
      return this.getCommonById(commonId);
    }

    return common;
  };

  public getCachedCommonById = async (
    commonId: string,
  ): Promise<Common | null> => {
    try {
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
    } catch (err) {
      const common = await this.getCommonById(commonId, true);
      store.dispatch(
        updateCommonState({
          commonId,
          state: {
            loading: false,
            fetched: true,
            data: common,
          },
        }),
      );

      return common;
    }
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

  public getCommonsByDirectParentId = async (
    parentCommonId: string,
    cached = false,
  ): Promise<Common[]> => {
    const snapshot = await firebase
      .firestore()
      .collection(Collection.Daos)
      .where("state", "==", CommonState.ACTIVE)
      .where("directParent.commonId", "==", parentCommonId)
      .withConverter(converter)
      .get({ source: cached ? "cache" : "default" });
    const commons = snapshot.docs.map((doc) => doc.data());

    if (cached && commons.length === 0) {
      return this.getCommonsByDirectParentId(parentCommonId);
    }

    return commons;
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

  public subscribeToCommonsByDirectParentId = (
    parentCommonId: string,
    callback: (
      data: {
        common: Common;
        statuses: {
          isAdded: boolean;
          isRemoved: boolean;
        };
      }[],
    ) => void,
  ): UnsubscribeFunction => {
    const query = firebase
      .firestore()
      .collection(Collection.Daos)
      .where("state", "==", CommonState.ACTIVE)
      .where("directParent.commonId", "==", parentCommonId)
      .withConverter(converter);

    return query.onSnapshot((snapshot) => {
      callback(
        snapshot.docChanges().map((docChange) => ({
          common: docChange.doc.data(),
          statuses: {
            isAdded: docChange.type === DocChange.Added,
            isRemoved: docChange.type === DocChange.Removed,
          },
        })),
      );
    });
  };

  public getUserCommonIds = async (userId: string): Promise<string[]> =>
    (
      await firebase
        .firestore()
        .collectionGroup(SubCollections.Members)
        .where("userId", "==", userId)
        .get()
    ).docs.map((ref) => ref.ref.path.split("/")[1]);

  public subscribeToUserCommonIds = (
    userId: string,
    callback: (data: string[]) => void,
  ): UnsubscribeFunction => {
    const query = firebase
      .firestore()
      .collectionGroup(SubCollections.Members)
      .where("userId", "==", userId);

    return query.onSnapshot((snapshot) => {
      const userCommonIds = snapshot.docs.map(
        (ref) => ref.ref.path.split("/")[1],
      );
      callback(userCommonIds);
    });
  };

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

  public subscribeToAllUserCommonMemberInfo = (
    userId: string,
    callback: (
      data: {
        commonId: string;
        commonMember: CommonMember;
        statuses: {
          isAdded: boolean;
          isRemoved: boolean;
        };
      }[],
    ) => void,
  ): UnsubscribeFunction => {
    const query = firebase
      .firestore()
      .collectionGroup(SubCollections.Members)
      .where("userId", "==", userId)
      .withConverter(commonMemberConverter);

    return query.onSnapshot((snapshot) => {
      callback(
        snapshot.docChanges().map((docChange) => ({
          commonId: docChange.doc.ref.path.split("/")[1],
          commonMember: docChange.doc.data(),
          statuses: {
            isAdded: docChange.type === DocChange.Added,
            isRemoved: docChange.type === DocChange.Removed,
          },
        })),
      );
    });
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

  public getCommonsByRootCommonId = async (
    rootCommonId: string,
  ): Promise<Common[]> => {
    const snapshot = await firebase
      .firestore()
      .collection(Collection.Daos)
      .where("state", "==", CommonState.ACTIVE)
      .where("rootCommonId", "==", rootCommonId)
      .withConverter(converter)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  };

  // Fetch all parent commons. Order: from root parent common to lowest ones
  public getAllParentCommonsForCommon = async (
    commonToCheck: Pick<Common, "directParent"> | string,
    cached = false,
  ): Promise<Common[]> => {
    const common =
      typeof commonToCheck === "string"
        ? await this.getCommonById(commonToCheck, cached)
        : commonToCheck;

    if (!common || common.directParent === null) {
      return [];
    }

    let finalCommons: Common[] = [];
    let nextCommonId = common.directParent.commonId;

    while (nextCommonId) {
      const common = await this.getCommonById(nextCommonId, cached);

      if (common) {
        finalCommons = [common, ...finalCommons];
      }

      nextCommonId = common?.directParent?.commonId || "";
    }

    return finalCommons;
  };

  public getCommonAndParents = async (
    commonId: string,
    cached = false,
  ): Promise<Common[]> => {
    const common = await this.getCommonById(commonId, cached);

    if (!common) {
      return [];
    }

    const parentCommons = await this.getAllParentCommonsForCommon(
      common,
      cached,
    );

    return [...parentCommons, common];
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
    source = FirestoreDataSource.Default,
  ): Promise<CommonMember | null> => {
    const snapshot = await commonMembersSubCollection(commonId)
      .where("userId", "==", userId)
      .get({ source });
    const members = snapshot.docs.map((doc) => doc.data());
    const member = members[0] || null;

    if (source === FirestoreDataSource.Cache && !member) {
      return this.getCommonMemberByUserId(
        commonId,
        userId,
        FirestoreDataSource.Server,
      );
    }

    return members[0] || null;
  };

  public getCommonMembers = async (
    commonId: string,
    circleVisibility: string[],
  ): Promise<CommonMember[]> => {
    let query: firebase.firestore.Query<CommonMember> =
      commonMembersSubCollection(commonId);

    if (circleVisibility.length > 0) {
      query = query.where("circleIds", "array-contains-any", circleVisibility);
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => doc.data());
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
    callback: (
      data: { common: Common; isRemoved: boolean }[],
      fromCache: boolean,
    ) => void,
  ): UnsubscribeFunction => {
    if (!parentCommonId) {
      return emptyFunction;
    }

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
      callback(data, snapshot.metadata.fromCache);
    });
  };

  public subscribeToCommonMemberByCommonIdAndUserId = (
    commonId: string,
    userId: string,
    callback: (
      data: {
        commonMember: CommonMember;
        statuses: {
          isAdded: boolean;
          isRemoved: boolean;
        };
      } | null,
    ) => void,
  ): UnsubscribeFunction => {
    const query = commonMembersSubCollection(commonId)
      .where("userId", "==", userId)
      .withConverter(commonMemberConverter);

    return query.onSnapshot((snapshot) => {
      const docChange = snapshot.docChanges()[0];

      callback(
        docChange
          ? {
              commonMember: docChange.doc.data(),
              statuses: {
                isAdded: docChange.type === DocChange.Added,
                isRemoved: docChange.type === DocChange.Removed,
              },
            }
          : null,
      );
    });
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

  /**
   * If a member can INVITE_TO_CIRCLE we use ASSIGN_CIRCLE to execute the action.
   */
  public inviteToCircle = async (
    circleId: string,
    commonId: string,
    userId: string,
  ): Promise<void> => {
    await Api.post(ApiEndpoint.CreateAction, {
      type: ProposalsTypes.ASSIGN_CIRCLE,
      args: { circleId, commonId, userId },
    });
  };

  public followCommon = async (commonId: string): Promise<void> => {
    await Api.post(ApiEndpoint.FollowCommon, { commonId });
  };

  public muteCommon = async (commonId: string): Promise<void> => {
    await Api.post(ApiEndpoint.MuteCommon, { commonId });
  };

  public deleteCommon = async (
    commonId: string,
    userId: string,
  ): Promise<void> => {
    await Api.post(ApiEndpoint.CreateAction, {
      type: GovernanceActions.DELETE_COMMON,
      args: { userId, commonId },
    });
  };

  public getCommonFlatTree = async (
    rootCommonId: string,
  ): Promise<CommonFlatTree | null> => {
    const snapshot = await firebase
      .firestore()
      .collection(Collection.DaosFlatTree)
      .doc(rootCommonId)
      .withConverter(commonFlatTreeConverter)
      .get();

    return snapshot.data() || null;
  };

  public markCommonAsSeen = async (
    commonId: string,
    userId: string,
  ): Promise<void> => {
    await Api.post(
      ApiEndpoint.MarkCommonSeenForUser,
      {
        commonId,
        userId
      },
    );
  };
}

export default new CommonService();
