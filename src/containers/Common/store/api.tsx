import {
  Card,
  Common,
  Discussion,
  DiscussionMessage,
  Proposal,
  User,
} from "../../../shared/models";
import {
  transformFirebaseDataList,
  transformFirebaseDataSingle,
} from "../../../shared/utils";
import firebase from "../../../shared/utils/firebase";

export async function fetchCommonDiscussions(commonId: string) {
  const commons = await firebase
    .firestore()
    .collection("discussion")
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
    .collection("proposals")
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
    .collection("proposals")
    .where("proposerId", "==", userId)
    .get();
  const data = transformFirebaseDataList<Proposal>(commons);

  return data.sort(
    (proposal: Proposal, prevProposal: Proposal) =>
      prevProposal.createdAt?.seconds - proposal.createdAt?.seconds
  );
}

export async function fetchCommonList(): Promise<Common[]> {
  const commons = await firebase.firestore().collection("daos").get();
  const data = transformFirebaseDataList<Common>(commons);
  return data;
}

export async function fetchCommonDetail(id: string): Promise<Common> {
  const common = await firebase.firestore().collection("daos").doc(id).get();
  const data = transformFirebaseDataSingle<Common>(common);
  return data;
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
      firebase.firestore().collection("users").where("uid", "in", ids).get()
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
        .collection("discussionMessage")
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
  callback: (card?: Card) => void,
): () => void {
  return firebase
    .firestore()
    .collection("cards")
    .doc(cardId)
    .onSnapshot((snapshot) => {
      callback(transformFirebaseDataSingle<Card>(snapshot));
    });
}
