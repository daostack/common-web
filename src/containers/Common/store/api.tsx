import { ApiEndpoint } from "@/shared/constants";
import Api from "@/services/Api";
import {
  CreateFundingRequestProposalPayload,
  ProposalJoinRequestData,
} from "@/shared/interfaces/api/proposal";
import {
  Card,
  Collection,
  Common,
  Discussion,
  DiscussionMessage,
  Proposal,
  User,
} from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  transformFirebaseDataList,
  transformFirebaseDataSingle,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import {
  AddMessageToProposalDto,
  CreateCommonPayload,
  CreateDiscussionDto,
  DeleteCommon,
  ImmediateContributionData,
  ImmediateContributionResponse,
} from "@/containers/Common/interfaces";
import { AddMessageToDiscussionDto } from "@/containers/Common/interfaces/AddMessageToDiscussionDto";
import { CreateVotePayload, Vote } from "@/shared/interfaces/api/vote";

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
  const commons = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .where("commonId", "==", commonId)
    .get();
  const data = transformFirebaseDataList<Proposal>(commons);

  return data.sort(
    (proposal: Proposal, prevProposal: Proposal) =>
      prevProposal.createdAt?.seconds - proposal.createdAt?.seconds
  );
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
  const commons = await firebase.firestore().collection(Collection.Daos).where("active", "==", true).get();
  const data = transformFirebaseDataList<Common>(commons);
  return data;
}

export async function fetchCommonDetail(id: string): Promise<Common> {
  const common = await firebase
    .firestore()
    .collection(Collection.Daos)
    .where("id", "==", id)
    .where("active", "==", true)
    .get();
  const data = transformFirebaseDataList<Common>(common);
  return data[0];
}

export async function fetchOwners(ownerids: string[]) {
  const idsChunks = ownerids.reduce((resultArray: any, item, index) => {
    const chunkIndex = Math.floor(index / 10);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  const users = await Promise.all(
    idsChunks.map((ids: string[]) =>
      firebase
        .firestore()
        .collection(Collection.Users)
        .where("uid", "in", ids)
        .get()
    )
  );

  const data = (users as unknown[])
    .map((d: any) => transformFirebaseDataList<User>(d))
    .reduce((resultArray: any, item) => {
      resultArray.push(...item);
      return resultArray;
    }, []);

  return data;
}

export async function fetchDiscussionsMessages(dIds: string[]) {
  const idsChunks = dIds.reduce((resultArray: any, item, index) => {
    const chunkIndex = Math.floor(index / 10);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  const discussions = await Promise.all(
    idsChunks.map((ids: string[]) =>
      firebase
        .firestore()
        .collection(Collection.DiscussionMessage)
        .where("discussionId", "in", ids)
        .get()
    )
  );
  const data = (discussions as unknown[])
    .map((d: any) => transformFirebaseDataList<DiscussionMessage>(d))
    .reduce((resultArray: any, item) => {
      resultArray.push(...item);
      return resultArray;
    }, [])
    .sort(
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

export async function createRequestToJoin(
  requestData: ProposalJoinRequestData
): Promise<Proposal> {
  const { data } = await Api.post<Proposal>(
    ApiEndpoint.CreateRequestToJoin,
    requestData
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export async function createFundingProposal(
  requestData: CreateFundingRequestProposalPayload
): Promise<Proposal> {
  const { data } = await Api.post<Proposal>(
    ApiEndpoint.CreateFunding,
    requestData
  );

  return convertObjectDatesToFirestoreTimestamps(data);
}

export async function createVote(requestData: CreateVotePayload): Promise<Vote> {
  const { data } = await Api.post<Vote>(
    ApiEndpoint.CreateVote,
    requestData
  );

  return data;
}

export async function checkUserPaymentMethod(userId: string): Promise<boolean> {
  const cards = await firebase
    .firestore()
    .collection(Collection.Cards)
    .where("ownerId", "==", userId)
    .get();

  return !!cards.docs.length;
}

export async function deleteCommon(requestData: DeleteCommon): Promise<void> {
  const { data } = await Api.post<void>(
    ApiEndpoint.DeleteCommon,
    requestData
  );

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

  return data;
}
