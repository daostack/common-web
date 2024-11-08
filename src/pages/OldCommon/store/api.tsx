import { getUserListByIds } from "@/pages/Auth/store/api";
import {
  AddFounderToMembersPayload,
  CreateCommonPayload,
  CreateDiscussionDto,
  CreateGovernancePayload,
  CreateProposal,
  ImmediateContributionData,
  ImmediateContributionResponse,
  LeaveCommon,
  CreateSubCommonPayload,
  UpdateCommonPayload,
  UserMembershipInfo,
  CreateReportDto,
  UpdateGovernanceRulesPayload,
  UpdateGovernanceRulesResponse,
} from "@/pages/OldCommon/interfaces";
import { CreateDiscussionMessageDto } from "@/pages/OldCommon/interfaces";
import Api from "@/services/Api";
import {
  AllocateFundsTo,
  ApiEndpoint,
  ProposalsTypes,
} from "@/shared/constants";
import { ModerationFlags } from "@/shared/interfaces/Moderation";
import { SubscriptionUpdateData } from "@/shared/interfaces/api/subscription";
import {
  CreateVotePayload,
  UpdateVotePayload,
} from "@/shared/interfaces/api/vote";
import {
  BankAccountDetails,
  Card,
  Circles,
  Collection,
  Common,
  CommonMember,
  CommonMemberWithUserInfo,
  CommonState,
  Discussion,
  DiscussionMessage,
  Governance,
  Payment,
  Proposal,
  SubCollections,
  Subscription,
  SupportersData,
  UnstructuredRules,
  User,
  Vote,
  VoteWithUserInfo,
  CommonMemberPreviewInfo,
  DirectParent,
} from "@/shared/models";
import { BankAccountDetails as AddBankDetailsPayload } from "@/shared/models/BankAccountDetails";
import { NotificationItem } from "@/shared/models/Notification";
import { FundsAllocation } from "@/shared/models/governance/proposals";
import {
  convertObjectDatesToFirestoreTimestamps,
  createIdsChunk,
  flatChunk,
  tokenHandler,
  transformFirebaseDataList,
  transformFirebaseDataSingle,
  sortByCreatedTime,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import { generateCirclesDataForCommonMember } from "../../../shared/utils/generateCircleDataForCommonMember";
import { ChangeVisibilityDto } from "../interfaces/ChangeVisibilityDto";
import { UpdateDiscussionMessageDto } from "../interfaces/UpdateDiscussionMessageDto";
import {
  UpdateGovernanceCirclesNamesPayload,
  UpdateGovernanceCirclesNamesResponse,
} from "../interfaces/UpdateGovernanceCircleName";

export async function createGovernance(
  requestData: CreateGovernancePayload,
): Promise<void> {
  await Api.post(ApiEndpoint.GovernanceCreate, requestData);
}

export async function addFounderToMembers(
  requestData: AddFounderToMembersPayload,
): Promise<void> {
  await Api.post(ApiEndpoint.AddFounderToMembers, requestData);
}

export async function fetchCommonDiscussions(commonId: string) {
  const commons = await firebase
    .firestore()
    .collection(Collection.Discussion)
    .where("commonId", "==", commonId)
    .where("proposalId", "==", null)
    .get();
  const data = transformFirebaseDataList<Discussion>(commons);

  return data.sort(
    (proposal: Discussion, prevProposal: Discussion) =>
      prevProposal.createdAt.seconds - proposal.createdAt.seconds,
  );
}

export async function fetchCommonProposals(commonId: string) {
  const proposals = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .where("data.args.commonId", "==", commonId)
    .get();

  const data = transformFirebaseDataList<Proposal>(proposals);

  return data.sort(
    (proposal: Proposal, prevProposal: Proposal) =>
      prevProposal.createdAt?.seconds - proposal.createdAt?.seconds,
  );
}

export async function fetchProposalsFromParentCommon(
  subCommonId: string,
  parentCommonId: string,
): Promise<FundsAllocation[]> {
  const proposals = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .where("data.args.commonId", "==", parentCommonId)
    .where("data.args.to", "==", AllocateFundsTo.SubCommon)
    .where("data.args.subcommonId", "==", subCommonId)
    .get();

  const data = transformFirebaseDataList<FundsAllocation>(proposals);

  return data.sort(
    (proposal: Proposal, prevProposal: Proposal) =>
      prevProposal.createdAt?.seconds - proposal.createdAt?.seconds,
  );
}

export async function fetchCommonContributions(
  commonId: string,
): Promise<Payment[]> {
  const payments = await firebase
    .firestore()
    .collection(Collection.Payments)
    .where("commonId", "==", commonId)
    .get();

  const data = transformFirebaseDataList<Payment>(payments);

  data.sort(sortByCreatedTime);

  return data;
}

export async function fetchProposalById(proposalId: string) {
  const proposal = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .doc(proposalId)
    .get();

  const data = transformFirebaseDataSingle<Proposal>(proposal);

  return data;
}

export async function fetchProposalByDiscussionId(discussionId: string) {
  const [proposals, discussion] = await Promise.all([
    firebase
      .firestore()
      .collection(Collection.Proposals)
      .where("discussionId", "==", discussionId)
      .get(),
    fetchDiscussionById(discussionId),
  ]);

  const data = transformFirebaseDataList<Proposal>(proposals)[0];

  return {
    ...data,
    discussion,
  };
}

export async function fetchDiscussionById(
  discussionId: string,
): Promise<Discussion | null> {
  const discussion = await firebase
    .firestore()
    .collection(Collection.Discussion)
    .doc(discussionId)
    .get();

  const data = transformFirebaseDataSingle<Discussion>(discussion);

  return data;
}

export async function fetchUserProposals(userId: string) {
  const commons = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .where("data.args.proposerId", "==", userId)
    .get();
  const data = transformFirebaseDataList<Proposal>(commons);

  return data.sort(
    (proposal: Proposal, prevProposal: Proposal) =>
      prevProposal.createdAt?.seconds - proposal.createdAt?.seconds,
  );
}

/**
 * For a space:
 * 1. The commonId needs to be the direct parent id and not the space id.
 * 2. circleId of the direct parent is required.
 */
export async function fetchUserMemberAdmittanceProposalWithCommonId(
  userId: string,
  commonId: string,
  directParent?: DirectParent | null,
) {
  let proposalQuery = firebase
    .firestore()
    .collection(Collection.Proposals)
    .where("data.args.proposerId", "==", userId)
    .where("data.args.commonId", "==", directParent?.commonId ?? commonId)
    .where(
      "type",
      "==",
      directParent?.circleId
        ? ProposalsTypes.ASSIGN_CIRCLE
        : ProposalsTypes.MEMBER_ADMITTANCE,
    );

  if (directParent?.circleId) {
    proposalQuery = proposalQuery.where(
      "data.args.circleId",
      "==",
      directParent.circleId,
    );
  }

  const proposal = await proposalQuery.get();

  return transformFirebaseDataList<Proposal>(proposal)[0];
}

export async function fetchCommonList(): Promise<Common[]> {
  const commons = await firebase
    .firestore()
    .collection(Collection.Daos)
    .where("state", "==", CommonState.ACTIVE)
    .orderBy("score", "desc")
    .get();
  const data = transformFirebaseDataList<Common>(commons);
  return data;
}

export async function fetchCommonListByIds(ids: string[]): Promise<Common[]> {
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
}

export async function fetchSubCommonsByCommonId(
  commonId: string,
): Promise<Common[]> {
  const commons = await firebase
    .firestore()
    .collection(Collection.Daos)
    .where("directParent.commonId", "==", commonId)
    .where("state", "==", CommonState.ACTIVE)
    .get();
  const data = transformFirebaseDataList<Common>(commons);
  return data;
}

export async function fetchCommonDetail(id: string): Promise<Common | null> {
  const common = await firebase
    .firestore()
    .collection(Collection.Daos)
    .where("id", "==", id)
    .where("state", "==", CommonState.ACTIVE)
    .get();
  const data = transformFirebaseDataList<Common>(common);
  return data[0] ? convertObjectDatesToFirestoreTimestamps(data[0]) : null;
}

export async function fetchOwners(ownerids: string[]) {
  const idsChunks = createIdsChunk(ownerids);

  const users = await Promise.all(
    idsChunks.map((ids: string[]) =>
      firebase
        .firestore()
        .collection(Collection.Users)
        .where("uid", "in", ids)
        .get(),
    ),
  );

  const data = flatChunk<User>(users);

  return data;
}

export async function fetchMessagesForCommonList(cIds: string[]) {
  const idsChunks = createIdsChunk(cIds);

  const messages = await Promise.all(
    idsChunks.map((ids: string[]) =>
      firebase
        .firestore()
        .collection(Collection.DiscussionMessage)
        .where("commonId", "in", ids)
        .get(),
    ),
  );

  return flatChunk<DiscussionMessage>(messages);
}

export async function fetchProposalsForCommonList(cIds: string[]) {
  const idsChunks = createIdsChunk(cIds);

  const proposals = await Promise.all(
    idsChunks.map((ids: string[]) =>
      firebase
        .firestore()
        .collection(Collection.Proposals)
        .where("commonId", "in", ids)
        .get(),
    ),
  );

  return flatChunk<Proposal>(proposals);
}

export async function fetchDiscussionForCommonList(cIds: string[]) {
  const idsChunks = createIdsChunk(cIds);

  const discussions = await Promise.all(
    idsChunks.map((ids: string[]) =>
      firebase
        .firestore()
        .collection(Collection.Discussion)
        .where("commonId", "in", ids)
        .get(),
    ),
  );

  return flatChunk<Discussion>(discussions);
}

export async function fetchDiscussionMessageById(discussionMsgId: string) {
  const discussionMsg = await firebase
    .firestore()
    .collection(Collection.DiscussionMessage)
    .doc(discussionMsgId)
    .get();

  const data = transformFirebaseDataSingle<DiscussionMessage>(discussionMsg);

  return data;
}

export async function fetchDiscussionsMessages(dIds: string[]) {
  const idsChunks = createIdsChunk(dIds);

  const discussions = await Promise.all(
    idsChunks.map((ids: string[]) =>
      firebase
        .firestore()
        .collection(Collection.DiscussionMessage)
        .where("discussionId", "in", ids)
        .get(),
    ),
  );
  const data = flatChunk<DiscussionMessage>(discussions)
    .filter(
      (discussionMessage: DiscussionMessage) =>
        discussionMessage.moderation?.flag !== ModerationFlags.Hidden,
    )
    .sort(
      (m: DiscussionMessage, mP: DiscussionMessage) =>
        m.createdAt.seconds - mP.createdAt.seconds,
    );

  return data;
}

export function subscribeToCardChange(
  cardId: string,
  callback: (card?: Card) => void,
): () => void {
  return firebase
    .firestore()
    .collection(Collection.Cards)
    .doc(cardId)
    .onSnapshot((snapshot) => {
      callback(transformFirebaseDataSingle<Card>(snapshot));
    });
}

export async function createDiscussion(
  payload: CreateDiscussionDto,
): Promise<Discussion> {
  const { data } = await Api.post<Discussion>(
    ApiEndpoint.CreateDiscussion,
    payload,
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export async function addMessageToDiscussion(
  payload: CreateDiscussionMessageDto,
): Promise<DiscussionMessage> {
  const { data } = await Api.post<DiscussionMessage>(
    ApiEndpoint.CreateDiscussionMessage,
    payload,
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export async function deleteDiscussionMessage(
  discussionMessageId: string,
): Promise<DiscussionMessage> {
  const { data } = await Api.delete<DiscussionMessage>(
    ApiEndpoint.CreateDiscussionMessage,
    {
      data: {
        id: discussionMessageId,
      },
    },
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export async function updateDiscussionMessage(
  payload: UpdateDiscussionMessageDto,
): Promise<DiscussionMessage> {
  const { data } = await Api.patch<DiscussionMessage>(
    ApiEndpoint.CreateDiscussionMessage,
    payload,
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export function subscribeToCommonDiscussion(
  commonId: string,
  callback: (payload: any) => void,
): () => void {
  const query = firebase
    .firestore()
    .collection(Collection.Discussion)
    .where("commonId", "==", commonId);
  return query.onSnapshot((snapshot) => {
    callback(transformFirebaseDataList(snapshot));
  });
}

export function subscribeToCommonProposal(
  commonId: string,
  callback: (payload: any) => void,
): () => void {
  const query = firebase
    .firestore()
    .collection(Collection.Proposals)
    .where("data.args.commonId", "==", commonId);
  const subscribe = query.onSnapshot((snapshot) => {
    callback(transformFirebaseDataList(snapshot));
    setTimeout(subscribe, 0);
  });
  return subscribe;
}

export function subscribeToProposal(
  proposalId: string,
  callback: (proposal: Proposal) => void,
): () => void {
  const query = firebase
    .firestore()
    .collection(Collection.Proposals)
    .doc(proposalId);
  const unsubscribe = query.onSnapshot((snapshot) => {
    callback(transformFirebaseDataSingle<Proposal>(snapshot));
  });

  return unsubscribe;
}

export function subscribeToMessages(
  discussionId: string,
  callback: (payload: any) => void,
): () => void {
  const query = firebase
    .firestore()
    .collection(Collection.DiscussionMessage)
    .where("discussionId", "==", discussionId);

  return query.onSnapshot((snapshot) => {
    callback(transformFirebaseDataList(snapshot));
  });
}

export async function createProposal<T extends keyof CreateProposal>(
  requestData: CreateProposal[T]["data"],
): Promise<CreateProposal[T]["response"]> {
  const { data } = await Api.post<CreateProposal[T]["response"]>(
    ApiEndpoint.CreateProposal,
    requestData,
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export async function createVote(
  requestData: CreateVotePayload,
): Promise<Vote> {
  const { data } = await Api.post<Vote>(ApiEndpoint.VoteProposal, requestData);

  return data;
}

export async function updateVote(
  requestData: UpdateVotePayload,
): Promise<Vote> {
  const { data } = await Api.patch<Vote>(ApiEndpoint.UpdateVote, requestData);

  return data;
}

export async function loadUserCards(userId: string): Promise<Card[]> {
  const cards = await firebase
    .firestore()
    .collection(Collection.Cards)
    .where("ownerId", "==", userId)
    .get();

  const data = transformFirebaseDataList<Card>(cards);

  return data;
}

export async function leaveCommon(requestData: LeaveCommon): Promise<void> {
  await Api.post<void>(ApiEndpoint.LeaveCommon, requestData);
}

export async function createCommon(
  requestData: CreateCommonPayload,
): Promise<Common> {
  const { data } = await Api.post<Common>(
    ApiEndpoint.CreateCommon,
    requestData,
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export async function createSubCommon(
  requestData: CreateSubCommonPayload,
): Promise<Common> {
  const { data } = await Api.post<Common>(
    ApiEndpoint.CreateSubCommon,
    requestData,
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export async function updateCommon(
  requestData: UpdateCommonPayload,
): Promise<Common> {
  await Api.post<Common>(ApiEndpoint.UpdateCommon, requestData);
  const common = await fetchCommonDetail(requestData.commonId);

  if (!common) {
    throw new Error(`Couldn't find common with id = "${requestData.commonId}"`);
  }

  return common;
}

export async function makeImmediateContribution(
  requestData: ImmediateContributionData,
): Promise<ImmediateContributionResponse> {
  const { data } = await Api.post<ImmediateContributionResponse>(
    ApiEndpoint.MakeImmediateContribution,
    {
      ...requestData,
      saveCard: requestData.saveCard ?? true,
    },
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export function subscribeToPayment(
  paymentId: string,
  callback: (payment?: Payment) => void,
): () => void {
  return firebase
    .firestore()
    .collection(Collection.Payments)
    .doc(paymentId)
    .onSnapshot((snapshot) => {
      callback(transformFirebaseDataSingle<Payment>(snapshot));
    });
}

export function subscribeToSubscription(
  subscriptionId: string,
  callback: (subscription?: Subscription) => void,
): () => void {
  return firebase
    .firestore()
    .collection(Collection.Subscriptions)
    .doc(subscriptionId)
    .onSnapshot((snapshot) => {
      callback(transformFirebaseDataSingle<Subscription>(snapshot));
    });
}

export async function getBankDetails(): Promise<BankAccountDetails> {
  const { data } = await Api.get<BankAccountDetails>(
    ApiEndpoint.GetBankAccount,
  );

  return convertObjectDatesToFirestoreTimestamps<BankAccountDetails>(data);
}

export async function getBankDetailsByUserId(
  userId: string,
): Promise<BankAccountDetails | null> {
  const result = await firebase
    .firestore()
    .collection(Collection.BankAccountDetails)
    .where("userId", "==", userId)
    .get();

  return transformFirebaseDataList<BankAccountDetails>(result)[0];
}

export async function addBankDetails(
  requestData: AddBankDetailsPayload,
): Promise<BankAccountDetails> {
  const { data } = await Api.post<BankAccountDetails>(
    ApiEndpoint.AddBankAccount,
    requestData,
  );

  return convertObjectDatesToFirestoreTimestamps<BankAccountDetails>(data);
}

export async function updateBankDetails(
  requestData: Partial<BankAccountDetails>,
): Promise<void> {
  await Api.patch(ApiEndpoint.UpdateBankAccount, requestData);
}

export async function deleteBankDetails(): Promise<BankAccountDetails> {
  const { data } = await Api.delete(ApiEndpoint.DeleteBankAccount);

  return convertObjectDatesToFirestoreTimestamps<BankAccountDetails>(data);
}

export async function getUserContributionsToCommon(
  commonId: string,
  userId: string,
): Promise<Payment[]> {
  const result = await firebase
    .firestore()
    .collection(Collection.Payments)
    .where("userId", "==", userId)
    .where("commonId", "==", commonId)
    .get();
  const payments = transformFirebaseDataList<Payment>(result);
  payments.sort(sortByCreatedTime);

  return payments;
}

export async function getUserContributions(userId: string): Promise<Payment[]> {
  const result = await firebase
    .firestore()
    .collection(Collection.Payments)
    .where("userId", "==", userId)
    .get();

  return transformFirebaseDataList<Payment>(result);
}

export async function getUserSubscriptions(
  userId: string,
): Promise<Subscription[]> {
  const result = await firebase
    .firestore()
    .collection(Collection.Subscriptions)
    .where("userId", "==", userId)
    .get();

  return transformFirebaseDataList<Subscription>(result);
}

export async function getSubscriptionById(
  subscriptionId: string,
): Promise<Subscription | null> {
  const result = await firebase
    .firestore()
    .collection(Collection.Subscriptions)
    .doc(subscriptionId)
    .get();

  return transformFirebaseDataSingle<Subscription>(result) || null;
}

export async function getUserSubscriptionToCommon(
  commonId: string,
  userId: string,
): Promise<Subscription | null> {
  const result = await firebase
    .firestore()
    .collection(Collection.Subscriptions)
    .where("userId", "==", userId)
    .where("commonId", "==", commonId)
    .get();
  const subscriptions = transformFirebaseDataList<Subscription>(result);

  return subscriptions.length > 0 ? subscriptions[0] : null;
}

export async function updateSubscription(
  requestData: SubscriptionUpdateData,
): Promise<Subscription> {
  const { data } = await Api.post<Subscription>(
    ApiEndpoint.UpdateSubscription,
    requestData,
  );

  return data;
}

export function subscribeToNotification(
  callback: (data?: NotificationItem) => void,
) {
  const user = tokenHandler.getUser();

  if (!user) return;

  const query = firebase
    .firestore()
    .collection(Collection.Notifications)
    .where("userFilter", "array-contains", user.uid);

  return query.onSnapshot((data) => {
    data.docChanges().forEach((change) => {
      switch (change.type) {
        case "added":
        case "modified":
          return callback({
            ...change.doc.data(),
            id: change.doc.id,
          } as NotificationItem);
      }
    });
  });
}

export async function getProposalById(proposalId: string) {
  const query = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .doc(proposalId)
    .get();

  return query.data() as Proposal;
}

export async function cancelSubscription(
  subscriptionId: string,
): Promise<void> {
  await Api.post<Subscription>(ApiEndpoint.CancelSubscription, {
    subscriptionId,
  });
}

export async function seenNotification(id: string): Promise<void> {
  await Api.post(ApiEndpoint.SeenNotification, {
    id,
  });
}

export const commonMembersSubCollection = (commonId: string) => {
  return firebase
    .firestore()
    .collection(Collection.Daos)
    .doc(commonId)
    .collection(SubCollections.Members)
    .withConverter<CommonMember>({
      fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot<CommonMember>,
      ): CommonMember {
        return snapshot.data();
      },

      toFirestore(
        object: Partial<CommonMember>,
      ): firebase.firestore.DocumentData {
        return object;
      },
    });
};

export const subscribeToCommonMembers = (
  commonId: string,
  callback: (commonMembers: CommonMember[]) => void,
): (() => void) => {
  return commonMembersSubCollection(commonId).onSnapshot((snapshot) => {
    callback(transformFirebaseDataList<CommonMember>(snapshot));
  });
};

export const getCommonMember = async (
  commonId: string,
  userId: string,
): Promise<CommonMember | null> => {
  const result = await commonMembersSubCollection(commonId)
    .where("userId", "==", userId)
    .get();
  const members = transformFirebaseDataList<CommonMember>(result);

  return members[0] || null;
};

export const getCommonMembers = async (
  commonId: string,
  circleVisibility: string[],
): Promise<CommonMemberWithUserInfo[]> => {
  const result = await (circleVisibility.length > 0
    ? commonMembersSubCollection(commonId)
        .where("circleIds", "array-contains-any", circleVisibility)
        .get()
    : commonMembersSubCollection(commonId).get());
  const members = transformFirebaseDataList<CommonMember>(result);
  const userIds = Array.from(new Set(members.map(({ userId }) => userId)));
  const users = await getUserListByIds(userIds);
  const extendedMembers = members.reduce<CommonMemberWithUserInfo[]>(
    (acc, member) => {
      const user = users.find(({ uid }) => uid === member.userId);

      return user ? acc.concat({ ...member, user }) : acc;
    },
    [],
  );

  return extendedMembers;
};

export const getCommonMemberInfo = async (
  userId: string,
  commonId: string,
): Promise<CommonMemberPreviewInfo> => {
  const commons = await getUserCommons(userId);
  const commonsWithCirclesInfo = await Promise.all(
    commons.map(async ({ id, name }) => {
      const [commonMemberInfo, governance] = await Promise.all([
        getCommonMember(id, userId),
        getGovernanceByCommonId(id),
      ]);

      const circlesData =
        governance &&
        commonMemberInfo &&
        generateCirclesDataForCommonMember(
          governance?.circles,
          commonMemberInfo?.circleIds,
        );

      return {
        id,
        name,
        circles: governance?.circles,
        circlesMap: circlesData?.circles.map,
      };
    }),
  );
  const proposal = await fetchUserMemberAdmittanceProposalWithCommonId(
    userId,
    commonId,
  );

  const introToCommon = proposal?.data.args.description;

  return {
    commons: commonsWithCirclesInfo,
    introToCommon,
  } as CommonMemberPreviewInfo;
};

export const getCommonMembersWithCircleIdAmount = async (
  commonId: string,
  circleId: string,
): Promise<number> => {
  const governance = await getGovernanceByCommonId(commonId);
  const circle = Object.values(governance?.circles || {}).find(
    (circle) => circle.id === circleId,
  );
  const result = await commonMembersSubCollection(commonId)
    .where(`circleIds`, "array-contains", circle?.id)
    .get();
  const members = transformFirebaseDataList<CommonMember>(result);

  return members.length;
};

export const getVotesWithUserInfo = async (
  proposalId: string,
): Promise<VoteWithUserInfo[]> => {
  const result = await proposalVotesSubCollection(proposalId)
    .orderBy("createdAt", "desc")
    .get();
  const votes = transformFirebaseDataList<Vote>(result);
  const userIds = Array.from(new Set(votes.map(({ voterId }) => voterId)));
  const users = await getUserListByIds(userIds);
  const extendedVotes = votes.reduce<VoteWithUserInfo[]>((acc, member) => {
    const user = users.find(({ uid }) => uid === member.voterId);

    return user ? acc.concat({ ...member, user }) : acc;
  }, []);

  return extendedVotes;
};

export const governanceCollection = firebase
  .firestore()
  .collection(Collection.Governance)
  .withConverter<Governance>({
    fromFirestore(
      snapshot: firebase.firestore.QueryDocumentSnapshot,
    ): Governance {
      return snapshot.data() as Governance;
    },

    toFirestore(object: Partial<Governance>): firebase.firestore.DocumentData {
      return object;
    },
  });

export const getGovernance = async (
  governanceId: string,
): Promise<Governance | null> => {
  const governance = (
    await governanceCollection.doc(governanceId).get()
  ).data();

  return governance || null;
};

export const getGovernanceByCommonId = async (
  commonId: string,
): Promise<Governance | null> => {
  const governanceList = await governanceCollection
    .where("commonId", "==", commonId)
    .get();

  return transformFirebaseDataList<Governance>(governanceList)[0] || null;
};

export const getCommonGovernanceRules = async (
  governanceId: string,
): Promise<UnstructuredRules> => {
  const governance = await getGovernance(governanceId);

  return governance?.unstructuredRules || [];
};

export const getCommonGovernanceCircles = async (
  governanceId: string,
): Promise<Circles | null> => {
  const governance = await getGovernance(governanceId);

  return governance?.circles || null;
};

export const getUserCommons = async (userId: string): Promise<Common[]> => {
  const querySnapshot = await firebase
    .firestore()
    .collectionGroup(SubCollections.Members)
    .where("userId", "==", userId)
    .get();
  const promises: Promise<firebase.firestore.DocumentSnapshot>[] = [];

  querySnapshot.forEach((queryDocumentSnapshot) => {
    const documentReference = queryDocumentSnapshot.ref;
    const documentGrandParent = documentReference.parent.parent;

    if (documentGrandParent) {
      promises.push(documentGrandParent.get());
    }
  });

  const results = await Promise.all(promises);

  return results
    .map((result) => result.data() as Common)
    .filter((common) => common.state === CommonState.ACTIVE);
};

export const verifyIsUserMemberOfAnyCommon = async (
  userId: string,
): Promise<boolean> => {
  const querySnapshot = await firebase
    .firestore()
    .collectionGroup(SubCollections.Members)
    .where("userId", "==", userId)
    .get();

  return !querySnapshot.empty;
};

export const getUserInfoAboutMemberships = async (
  userId: string,
): Promise<UserMembershipInfo[]> => {
  const querySnapshot = await firebase
    .firestore()
    .collectionGroup(SubCollections.Members)
    .where("userId", "==", userId)
    .get();
  const promises: (() => Promise<UserMembershipInfo>)[] = [];

  querySnapshot.forEach((queryDocumentSnapshot) => {
    promises.push(async (): Promise<UserMembershipInfo> => {
      const documentReference = queryDocumentSnapshot.ref;
      const documentGrandParent = documentReference.parent.parent;
      const commonMember = (
        await documentReference.get()
      ).data() as CommonMember;

      if (!documentGrandParent) {
        throw new Error(
          `There is no common for common member with id = ${commonMember.id}`,
        );
      }

      const common = (await documentGrandParent.get()).data() as Common;

      if (!common) {
        throw new Error(
          `Couldn't find common for common member with id = ${commonMember.id}`,
        );
      }
      if (!common.governanceId) {
        throw new Error(
          `There is no governance id in common with id = ${common.id}`,
        );
      }

      const governance = await getGovernance(common.governanceId);

      if (!governance) {
        throw new Error(
          `Couldn't find governance by id = ${common.governanceId}`,
        );
      }

      return {
        common,
        governance,
        commonMember,
      };
    });
  });

  const results = await Promise.allSettled(promises.map((func) => func()));

  return results
    .filter(
      (result): result is PromiseFulfilledResult<UserMembershipInfo> =>
        result.status === "fulfilled",
    )
    .map((result) => result.value);
};

export const proposalVotesSubCollection = (proposalId: string) => {
  return firebase
    .firestore()
    .collection(Collection.Proposals)
    .doc(proposalId)
    .collection(SubCollections.Votes)
    .withConverter<Vote>({
      fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot<Vote>,
      ): Vote {
        return snapshot.data();
      },

      toFirestore(object: Partial<Vote>): firebase.firestore.DocumentData {
        return object;
      },
    });
};

export const getVote = async (
  proposalId: string,
  userId: string,
): Promise<Vote | null> => {
  const [vote] = (
    await proposalVotesSubCollection(proposalId)
      .where("voterId", "==", userId)
      .get()
  ).docs;
  return vote?.data() || null;
};

export async function getDiscussionsByIds(
  initialIds: string[],
): Promise<Discussion[]> {
  const ids = initialIds.filter(Boolean);

  if (ids.length === 0) {
    return [];
  }

  const queries: firebase.firestore.Query[] = [];
  const config = firebase.firestore().collection(Collection.Discussion);

  // Firebase allows to use at most 10 items per query for `in` option
  for (let i = 0; i < ids.length; i += 10) {
    queries.push(config.where("id", "in", ids.slice(i, i + 10)));
  }
  const results = await Promise.all(queries.map((query) => query.get()));

  return results
    .map((result) => transformFirebaseDataList<Discussion>(result))
    .reduce((acc, items) => [...acc, ...items], []);
}

export async function fetchSupportersDataByCommonId(
  commonId: string,
): Promise<SupportersData | null> {
  const supportersData = await firebase
    .firestore()
    .collection(Collection.Supporters)
    .where("commonId", "==", commonId)
    .get();
  const data = transformFirebaseDataList<SupportersData>(supportersData);

  return data[0] ? convertObjectDatesToFirestoreTimestamps(data[0]) : null;
}

export async function createReport(
  requestData: CreateReportDto,
): Promise<DiscussionMessage> {
  const { data } = await Api.post<DiscussionMessage>(
    ApiEndpoint.CreateReport,
    requestData,
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export async function hideContent(
  requestData: ChangeVisibilityDto,
): Promise<DiscussionMessage> {
  const { data } = await Api.post<DiscussionMessage | Discussion | Proposal>(
    ApiEndpoint.HideContent,
    requestData,
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export async function showContent(
  requestData: ChangeVisibilityDto,
): Promise<DiscussionMessage> {
  const { data } = await Api.post<DiscussionMessage | Discussion | Proposal>(
    ApiEndpoint.ShowContent,
    requestData,
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export async function updateGovernanceRules(
  payload: UpdateGovernanceRulesPayload,
): Promise<UpdateGovernanceRulesResponse> {
  const { data } = await Api.post<Governance>(
    ApiEndpoint.GovernanceUpdateRules,
    payload,
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export async function updateGovernanceCirclesNames(
  payload: UpdateGovernanceCirclesNamesPayload,
): Promise<UpdateGovernanceCirclesNamesResponse> {
  const { data } = await Api.put<Governance>(
    ApiEndpoint.GovernanceUpdateCircleName,
    payload,
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}
