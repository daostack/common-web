import { ProposalsTypes } from "@/shared/constants";
import { Collection, Proposal, ProposalState } from "@/shared/models";
import {
  AssignCircle,
  RemoveCircle,
} from "@/shared/models/governance/proposals";
import {
  checkIsCountdownState,
  firestoreDataConverter,
  transformFirebaseDataList,
  transformFirebaseDataSingle,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";

const converter = firestoreDataConverter<Proposal>();

class ProposalService {
  private getProposalCollection = () =>
    firebase
      .firestore()
      .collection(Collection.Proposals)
      .withConverter(converter);

  public getProposalById = async (
    proposalId: string,
  ): Promise<Proposal | null> => {
    const proposal = await this.getProposalCollection().doc(proposalId).get();

    return (
      (proposal && transformFirebaseDataSingle<Proposal>(proposal)) || null
    );
  };

  public checkActiveProposalsExistenceInCommon = async (
    commonId: string,
  ): Promise<boolean> => {
    const snapshot = await firebase
      .firestore()
      .collection(Collection.Proposals)
      .where("data.args.commonId", "==", commonId)
      .where("state", "in", [ProposalState.VOTING, ProposalState.DISCUSSION])
      .get();

    return !snapshot.empty;
  };

  public subscribeToUserPendingCircleProposals = (
    commonId: string,
    userId: string,
    callback: (payload: (AssignCircle | RemoveCircle)[]) => void,
  ): (() => void) => {
    const query = firebase
      .firestore()
      .collection(Collection.Proposals)
      .where("data.args.commonId", "==", commonId)
      .where("data.args.proposerId", "==", userId)
      .where("type", "in", [
        ProposalsTypes.ASSIGN_CIRCLE,
        ProposalsTypes.REMOVE_CIRCLE,
      ]);
    const unsubscribe = query.onSnapshot((snapshot) => {
      const list = transformFirebaseDataList<AssignCircle | RemoveCircle>(
        snapshot,
      ).filter((proposal) => checkIsCountdownState(proposal));
      callback(list);
    });
    return unsubscribe;
  };
}

export default new ProposalService();
