import { ApiEndpoint } from "@/shared/constants";
import Api from "@/services/Api";
import { SubscriptionUpdateData } from "@/shared/interfaces/api/subscription";
import {
  BankAccountDetails,
  Card,
  Collection,
  Common,
  CommonMember,
  CommonState,
  Discussion,
  DiscussionMessage,
  Governance,
  Payment,
  Proposal,
  SubCollections,
  Subscription,
  UnstructuredRules,
  User,
  Vote,
} from "@/shared/models";
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
import {
  AddFounderToMembersPayload,
  AddMessageToProposalDto,
  CreateCommonPayload,
  CreateDiscussionDto,
  DeleteCommon,
  CreateGovernancePayload,
  CreateProposal,
  ImmediateContributionData,
  ImmediateContributionResponse,
  LeaveCommon,
} from "@/containers/Common/interfaces";
import { AddMessageToDiscussionDto } from "@/containers/Common/interfaces/AddMessageToDiscussionDto";
import {
  CreateVotePayload,
  UpdateVotePayload,
} from "@/shared/interfaces/api/vote";
import { BankAccountDetails as AddBankDetailsPayload } from "@/shared/models/BankAccountDetails";
import { UpdateBankAccountDetailsData } from "@/shared/interfaces/api/bankAccount";
import { NotificationItem } from "@/shared/models/Notification";

export async function createGovernance(
  requestData: CreateGovernancePayload
): Promise<void> {
  await Api.post(ApiEndpoint.GovernanceCreate, requestData);
}

export async function addFounderToMembers(
  requestData: AddFounderToMembersPayload
): Promise<void> {
  await Api.post(ApiEndpoint.AddFounderToMembers, requestData);
}

export async function fetchCommonDiscussions(commonId: string) {
  const commons = await firebase
    .firestore()
    .collection(Collection.Discussion)
    .where("commonId", "==", commonId)
    .get();
  const data = transformFirebaseDataList<Discussion>(commons);

  return data.sort(
    (proposal: Discussion, prevProposal: Discussion) =>
      prevProposal.createTime?.seconds - proposal.createTime?.seconds
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
      prevProposal.createdAt?.seconds - proposal.createdAt?.seconds
  );
}

export async function fetchCommonContributions(commonId: string): Promise<Payment[]> {
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

export async function fetchDiscussionById(discussionId: string) {
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
    .where("proposerId", "==", userId)
    .get();
  const data = transformFirebaseDataList<Proposal>(commons);

  return data.sort(
    (proposal: Proposal, prevProposal: Proposal) =>
      prevProposal.createdAt?.seconds - proposal.createdAt?.seconds
  );
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

export async function fetchCommonDetail(id: string): Promise<Common | null> {
  const common = await firebase
    .firestore()
    .collection(Collection.Daos)
    .where("id", "==", id)
    .where("state", "==", CommonState.ACTIVE)
    .get();
  const data = transformFirebaseDataList<Common>(common);
  return data[0] || null;
}

export async function fetchOwners(ownerids: string[]) {
  const idsChunks = createIdsChunk(ownerids);

  const users = await Promise.all(
    idsChunks.map((ids: string[]) =>
      firebase
        .firestore()
        .collection(Collection.Users)
        .where("uid", "in", ids)
        .get()
    )
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
        .get()
    )
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
        .get()
    )
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
        .get()
    )
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
        .get()
    )
  );
  const data = flatChunk<DiscussionMessage>(discussions).sort(
    (m: DiscussionMessage, mP: DiscussionMessage) =>
      m.createTime?.seconds - mP.createTime?.seconds
  );

  return data;
}

export function subscribeToCardChange(
  cardId: string,
  callback: (card?: Card) => void
): () => void {
  return firebase
    .firestore()
    .collection(Collection.Cards)
    .doc(cardId)
    .onSnapshot((snapshot) => {
      callback(transformFirebaseDataSingle<Card>(snapshot));
    });
}

export function createDiscussion(payload: CreateDiscussionDto) {
  try {
    return firebase
      .firestore()
      .collection(Collection.Discussion)
      .doc()
      .set(payload)
      .then((value) => {
        return value;
      });
  } catch (e) {
    console.log("createDiscussion", e);
  }
}

export function addMessageToDiscussion(
  payload: AddMessageToDiscussionDto | AddMessageToProposalDto
) {
  try {
    return firebase
      .firestore()
      .collection(Collection.DiscussionMessage)
      .doc()
      .set(payload)
      .then((value) => {
        return value;
      });
  } catch (e) {
    console.log("addMessageToDiscussion", e);
  }
}

export function subscribeToCommonDiscussion(
  commonId: string,
  callback: (payload: any) => void
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
  callback: (payload: any) => void
): () => void {
  const query = firebase
    .firestore()
    .collection(Collection.Proposals)
    .where("commonId", "==", commonId);
  const subscribe = query.onSnapshot((snapshot) => {
    callback(transformFirebaseDataList(snapshot));
    setTimeout(subscribe, 0);
  });
  return subscribe;
}

export function subscribeToMessages(
  discussionId: string,
  callback: (payload: any) => void
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
  requestData: CreateProposal[T]["data"]
): Promise<CreateProposal[T]["response"]> {
  const { data } = await Api.post<CreateProposal[T]["response"]>(
    ApiEndpoint.CreateProposal,
    requestData
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export async function createVote(
  requestData: CreateVotePayload
): Promise<Vote> {
  const { data } = await Api.post<Vote>(ApiEndpoint.VoteProposal, requestData);

  return data;
}

export async function updateVote(
  requestData: UpdateVotePayload
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

export async function deleteCommon(requestData: DeleteCommon): Promise<void> {
  const { data } = await Api.post<void>(ApiEndpoint.DeleteCommon, requestData);

  return data;
}

export async function createCommon(
  requestData: CreateCommonPayload
): Promise<Common> {
  const { data } = await Api.post<Common>(
    ApiEndpoint.CreateCommon,
    requestData
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export async function makeImmediateContribution(
  requestData: ImmediateContributionData
): Promise<ImmediateContributionResponse> {
  const { data } = await Api.post<ImmediateContributionResponse>(
    ApiEndpoint.MakeImmediateContribution,
    requestData
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export function subscribeToPayment(
  paymentId: string,
  callback: (payment?: Payment) => void
): () => void {
  return firebase
    .firestore()
    .collection(Collection.Payments)
    .doc(paymentId)
    .onSnapshot((snapshot) => {
      callback(transformFirebaseDataSingle<Payment>(snapshot));
    });
}

export async function getBankDetails(): Promise<BankAccountDetails> {
  const { data } = await Api.get<BankAccountDetails>(
    ApiEndpoint.GetBankAccount
  );

  return convertObjectDatesToFirestoreTimestamps<BankAccountDetails>(data);
}

export async function addBankDetails(
  requestData: AddBankDetailsPayload
): Promise<BankAccountDetails> {
  const { data } = await Api.post<BankAccountDetails>(
    ApiEndpoint.AddBankAccount,
    requestData
  );

  return convertObjectDatesToFirestoreTimestamps<BankAccountDetails>(data);
}

export async function updateBankDetails(
  requestData: Partial<UpdateBankAccountDetailsData>
): Promise<void> {
  await Api.patch(ApiEndpoint.UpdateBankAccount, requestData);
}

export async function getUserContributionsToCommon(
  commonId: string,
  userId: string
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
  userId: string
): Promise<Subscription[]> {
  const result = await firebase
    .firestore()
    .collection(Collection.Subscriptions)
    .where("userId", "==", userId)
    .get();

  return transformFirebaseDataList<Subscription>(result);
}

export async function getSubscriptionById(
  subscriptionId: string
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
  userId: string
): Promise<Subscription | null> {
  const result = await firebase
    .firestore()
    .collection(Collection.Subscriptions)
    .where("userId", "==", userId)
    .where("metadata.common.id", "==", commonId)
    .get();
  const subscriptions = transformFirebaseDataList<Subscription>(result);

  return subscriptions.length > 0 ? subscriptions[0] : null;
}

export async function updateSubscription(
  requestData: SubscriptionUpdateData
): Promise<Subscription> {
  const { data } = await Api.post<Subscription>(
    ApiEndpoint.UpdateSubscription,
    requestData
  );

  return data;
}

export function subscribeToNotification(
  callback: (data?: NotificationItem) => void
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
  subscriptionId: string
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

// TODO: verify it's the correct place to have these functions
export const commonMembersSubCollection = (commonId: string) => {
  return firebase
    .firestore()
    .collection(Collection.Daos)
    .doc(commonId)
    .collection(SubCollections.Members)
    .withConverter<CommonMember>({
      fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot<CommonMember>
      ): CommonMember {
        return snapshot.data();
      },

      toFirestore(
        object: Partial<CommonMember>
      ): firebase.firestore.DocumentData {
        return object;
      },
    });
};

export const getCommonMember = async (
  commonId: string,
  userId: string
): Promise<CommonMember | null> => {
  const result = await commonMembersSubCollection(commonId)
    .where("userId", "==", userId)
    .get();
  const members = transformFirebaseDataList<CommonMember>(result);

  return members[0] || null;
};

export const governanceCollection = firebase
  .firestore()
  .collection(Collection.Governance)
  .withConverter<Governance>({
    fromFirestore(
      snapshot: firebase.firestore.QueryDocumentSnapshot
    ): Governance {
      return snapshot.data() as Governance;
    },

    toFirestore(object: Partial<Governance>): firebase.firestore.DocumentData {
      return object;
    },
  });

export const getGovernance = async (
  governanceId: string
): Promise<Governance | null> => {
  const governance = (
    await governanceCollection.doc(governanceId).get()
  ).data();

  return governance || null;
};

export const getCommonGovernanceRules = async (
  governanceId: string
): Promise<UnstructuredRules | null> => {
  const governance = await getGovernance(governanceId);

  return governance?.unstructuredRules || null;
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

export const verifyIsUserMemberOfAnyCommon = async (userId: string): Promise<boolean> => {
  const querySnapshot = await firebase
    .firestore()
    .collectionGroup(SubCollections.Members)
    .where("userId", "==", userId)
    .get();

  return !querySnapshot.empty;
};

export const proposalVotesSubCollection = (proposalId: string) => {
  return firebase
    .firestore()
    .collection(Collection.Proposals)
    .doc(proposalId)
    .collection(SubCollections.Votes)
    .withConverter<Vote>({
      fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot<Vote>
      ): Vote {
        return snapshot.data();
      },

      toFirestore(
        object: Partial<Vote>
      ): firebase.firestore.DocumentData {
        return object;
      },
    });
};

export const getVote = async (
  proposalId: string,
  userId: string
): Promise<Vote | null> => {
  const [vote] = (await proposalVotesSubCollection(proposalId).where("voterId", "==", userId).get()).docs;
  return vote?.data() || null;
};
