import { getUserListByIds } from "@/pages/Auth/store/api";
import { CreateProposal } from "@/pages/OldCommon/interfaces";
import { createProposal } from "@/pages/OldCommon/store/api";
import { ApiEndpoint, ProposalsTypes } from "@/shared/constants";
import { UnsubscribeFunction } from "@/shared/interfaces";
import {
  Collection,
  EligibleVoter,
  EligibleVoterWithUserInfo,
  Proposal,
  ProposalState,
} from "@/shared/models";
import {
  AssignCircle,
  RemoveCircle,
  MemberAdmittance,
} from "@/shared/models/governance/proposals";
import {
  checkIsCountdownState,
  firestoreDataConverter,
  transformFirebaseDataList,
  transformFirebaseDataSingle,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import Api from "./Api";

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

  public createMemberAdmittanceProposal = async (
    payload: Omit<
      CreateProposal[ProposalsTypes.MEMBER_ADMITTANCE]["data"],
      "type"
    >,
  ): Promise<CreateProposal[ProposalsTypes.MEMBER_ADMITTANCE]["response"]> => {
    const createdProposal = (await createProposal({
      ...payload,
      type: ProposalsTypes.MEMBER_ADMITTANCE,
    })) as MemberAdmittance;

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

  public proposalEligibleVoters = async (
    proposalId: string,
  ): Promise<EligibleVoterWithUserInfo[]> => {
    const votersObject = (
      await Api.get<EligibleVoter[]>(
        `${ApiEndpoint.EligibleVoters}/${proposalId}`,
      )
    ).data;

    /**
     * TODO: temporary because the backend returns object of object instead of array of objects
     */
    const votersArray = Object.values(votersObject);
    votersArray.pop();

    const userIds = Array.from(
      new Set(votersArray.map(({ userId }) => userId)),
    );
    const users = await getUserListByIds(userIds);

    const extendedVoters = votersArray.reduce<EligibleVoterWithUserInfo[]>(
      (acc, member) => {
        const user = users.find(({ uid }) => uid === member.userId);
        return user ? acc.concat({ ...member, user }) : acc;
      },
      [],
    );

    /**
     * Sort the array: mamaber with no votes yet are at the end.
     */
    extendedVoters.sort((a, b) => (a.vote && !b.vote ? -1 : 0));

    return extendedVoters;
  };
}

export default new ProposalService();
