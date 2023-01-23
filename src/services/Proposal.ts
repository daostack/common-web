import { CreateProposal } from "@/pages/OldCommon/interfaces";
import { createProposal } from "@/pages/OldCommon/store/api";
import { ProposalsTypes } from "@/shared/constants";
import { UnsubscribeFunction } from "@/shared/interfaces";
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

  public subscribeToProposal = (
    proposalId: string,
    callback: (proposal: Proposal) => void,
  ): UnsubscribeFunction => {
    const query = this.getProposalCollection().doc(proposalId);

    return query.onSnapshot((snapshot) => {
      callback(transformFirebaseDataSingle<Proposal>(snapshot));
    });
  };

  public createAssignProposal = async (
    payload: Omit<CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["data"], "type">,
  ): Promise<CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["response"]> => {
    const createdProposal = (await createProposal({
      ...payload,
      type: ProposalsTypes.ASSIGN_CIRCLE,
    })) as AssignCircle;

    return createdProposal;
  };

  public checkHasUserPendingMemberAdmittanceProposal = async (
    commonId: string,
    userId: string,
  ): Promise<boolean> => {
    const snapshot = await this.getProposalCollection()
      .where("type", "==", ProposalsTypes.MEMBER_ADMITTANCE)
      .where("data.args.proposerId", "==", userId)
      .where("data.args.commonId", "==", commonId)
      .where("state", "in", [ProposalState.VOTING, ProposalState.DISCUSSION])
      .get();

    return !snapshot.empty;
  };
}

export default new ProposalService();
