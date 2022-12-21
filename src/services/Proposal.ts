import { ProposalsTypes } from "@/shared/constants";
import { Collection, ProposalState } from "@/shared/models";
import { AssignCircle, RemoveCircle } from "@/shared/models/governance/proposals";
import { transformFirebaseDataList } from "@/shared/utils";
import firebase from "@/shared/utils/firebase";

class ProposalService {
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
  ): () => void =>{
    const query = firebase
      .firestore()
      .collection(Collection.Proposals)
      .where("data.args.commonId", "==", commonId)
      .where("data.args.proposerId", "==", userId)
      .where("type", "in", [
        ProposalsTypes.ASSIGN_CIRCLE,
        ProposalsTypes.REMOVE_CIRCLE,
      ]);
    const subscribe = query.onSnapshot((snapshot) => {
      const list = transformFirebaseDataList<AssignCircle | RemoveCircle>(
        snapshot,
      ).filter(({ state }) =>
        [ProposalState.DISCUSSION, ProposalState.VOTING].includes(state),
      );
      callback(list);
      setTimeout(subscribe, 0);
    });
    return subscribe;
  }
}

export default new ProposalService();
