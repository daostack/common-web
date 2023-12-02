import { getUserListByIds } from "@/pages/Auth/store/api";
import {
  CreateProposal,
  CreateProposalWithFiles,
} from "@/pages/OldCommon/interfaces";
import { createProposal as createProposalApi } from "@/pages/OldCommon/store/api";
import { ApiEndpoint, ProposalsTypes } from "@/shared/constants";
import { UnsubscribeFunction } from "@/shared/interfaces";
import { EligibleVotersApiResponse } from "@/shared/interfaces/api/eligibleVoters";
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
  Survey,
  MemberAdmittance,
  FundsAllocation,
} from "@/shared/models/governance/proposals";
import {
  checkIsCountdownState,
  convertObjectDatesToFirestoreTimestamps,
  firestoreDataConverter,
  transformFirebaseDataList,
  transformFirebaseDataSingle,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import { Api, FileService } from ".";

const converter = firestoreDataConverter<Proposal>();
const memberAdmittanceProposalConverter =
  firestoreDataConverter<MemberAdmittance>();

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
      const proposal = snapshot.data();

      if (proposal) {
        callback(proposal);
      }
    });
  };

  createProposal = async <T extends keyof CreateProposal>(
    requestData: CreateProposal[T]["data"],
  ): Promise<CreateProposal[T]["response"]> => {
    const { data } = await Api.post<CreateProposal[T]["response"]>(
      ApiEndpoint.CreateProposal,
      requestData,
    );

    return convertObjectDatesToFirestoreTimestamps(data);
  };

  public createAssignProposal = async (
    payload: Omit<CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["data"], "type">,
  ): Promise<CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["response"]> => {
    const createdProposal = (await this.createProposal({
      ...payload,
      type: ProposalsTypes.ASSIGN_CIRCLE,
    })) as AssignCircle;

    return createdProposal;
  };

  public createSurveyProposal = async (
    payload: CreateProposalWithFiles<ProposalsTypes.SURVEY>,
  ): Promise<Proposal> => {
    const [files, images] = await Promise.all([
      FileService.uploadFiles(payload.files || []),
      FileService.uploadFiles(payload.images || []),
    ]);
    return (await this.createProposal({
      args: {
        ...payload,
        files,
        images,
      },
      type: ProposalsTypes.SURVEY,
    })) as Survey;
  };

  public createFundingProposal = async (
    payload: CreateProposalWithFiles<ProposalsTypes.FUNDS_ALLOCATION>,
  ): Promise<Proposal> => {
    const [files, images] = await Promise.all([
      FileService.uploadFiles(payload.files || []),
      FileService.uploadFiles(payload.images || []),
    ]);
    return (await this.createProposal({
      args: {
        ...payload,
        files,
        images,
      },
      type: ProposalsTypes.FUNDS_ALLOCATION,
    })) as FundsAllocation;
  };

  public createMemberAdmittanceProposal = async (
    payload: Omit<
      CreateProposal[ProposalsTypes.MEMBER_ADMITTANCE]["data"],
      "type"
    >,
  ): Promise<CreateProposal[ProposalsTypes.MEMBER_ADMITTANCE]["response"]> => {
    const createdProposal = (await createProposalApi({
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

  public getUserMemberAdmittanceProposalByCommonId = async (
    userId: string,
    commonId: string,
  ): Promise<MemberAdmittance | null> => {
    const snapshot = await this.getProposalCollection()
      .withConverter(memberAdmittanceProposalConverter)
      .where("type", "==", ProposalsTypes.MEMBER_ADMITTANCE)
      .where("data.args.proposerId", "==", userId)
      .where("data.args.commonId", "==", commonId)
      .get();

    return snapshot.docs[0]?.data() || null;
  };

  public checkHasUserAssignProjectCircleProposal = async (
    commonId: string,
    circleId: string,
    userId: string,
  ): Promise<boolean> => {
    const snapshot = await this.getProposalCollection()
      .where("type", "==", ProposalsTypes.ASSIGN_CIRCLE)
      .where("data.args.proposerId", "==", userId)
      .where("data.args.commonId", "==", commonId)
      .where("data.args.circleId", "==", circleId)
      .where("state", "in", [ProposalState.VOTING, ProposalState.DISCUSSION])
      .get();

    return !snapshot.empty;
  };

  public getProposalEligibleVoters = async (
    proposalId: string,
  ): Promise<EligibleVoterWithUserInfo[]> => {
    const { data } = await Api.get<EligibleVotersApiResponse>(
      ApiEndpoint.GetProposalEligibleVoters.replace(":proposalId", proposalId),
    );

    const parsedData: EligibleVoter[] = data.data.map((voter) => ({
      ...voter,
      vote: convertObjectDatesToFirestoreTimestamps(voter.vote),
    }));

    const userIds = Array.from(new Set(parsedData.map(({ userId }) => userId)));
    const users = await getUserListByIds(userIds);

    const extendedVoters = parsedData.reduce<EligibleVoterWithUserInfo[]>(
      (acc, member) => {
        const user = users.find(({ uid }) => uid === member.userId);
        return user ? acc.concat({ ...member, user }) : acc;
      },
      [],
    );

    /**
     * Sort the array: members with no votes yet are at the end.
     */
    extendedVoters.sort((a, b) => (a.vote && !b.vote ? -1 : 0));

    return extendedVoters;
  };

  public deleteProposal = async (proposalId: string): Promise<void> => {
    await Api.delete(ApiEndpoint.DeleteProposal(proposalId));
  };
}

export default new ProposalService();
