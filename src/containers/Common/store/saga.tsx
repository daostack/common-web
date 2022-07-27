import { call, put, select, takeLatest } from "redux-saga/effects";
import { isRequestError } from "@/services/Api";
import PayMeService from "@/services/PayMeService";
import { ErrorCode } from "@/shared/constants";
import { actions } from ".";
import {
  Card,
  Common,
  CommonPayment,
  Discussion,
  User,
  DiscussionMessage,
  Proposal,
  Payment,
  Subscription,
  BankAccountDetails,
  Vote,
} from "../../../shared/models";
import { startLoading, stopLoading } from "@/shared/store/actions";
import {
  createCommon as createCommonApi,
  createProposal as createProposalApi,
  fetchCommonList,
  fetchCommonDetail,
  fetchCommonDiscussions,
  fetchCommonProposals,
  fetchOwners,
  fetchDiscussionsMessages,
  fetchUserProposals,
  createDiscussion,
  subscribeToCommonDiscussion,
  addMessageToDiscussion,
  subscribeToMessages,
  subscribeToCommonProposal,
  subscribeToProposal,
  leaveCommon as leaveCommonApi,
  loadUserCards,
  deleteCommon as deleteCommonApi,
  createVote as createVoteApi,
  updateVote as updateVoteApi,
  makeImmediateContribution as makeImmediateContributionApi,
  addBankDetails as addBankDetailsApi,
  updateBankDetails as updateBankDetailsApi,
  deleteBankDetails as deleteBankDetailsApi,
  getBankDetails as getBankDetailsApi,
  getUserContributionsToCommon as getUserContributionsToCommonApi,
  getUserContributions as getUserContributionsApi,
  getUserSubscriptionToCommon as getUserSubscriptionToCommonApi,
  getUserSubscriptions as getUserSubscriptionsApi,
  updateSubscription as updateSubscriptionApi,
  cancelSubscription as cancelSubscriptionApi,
  getSubscriptionById,
  fetchDiscussionForCommonList,
  fetchProposalsForCommonList,
  fetchMessagesForCommonList,
  fetchCommonListByIds as fetchCommonListByIdsApi,
  createGovernance as createGovernanceApi,
  getGovernance as getGovernanceApi,
  getCommonMember as getCommonMemberApi,
  getCommonMembers as getCommonMembersApi,
  getUserCommons as getUserCommonsApi,
} from "./api";
import { getUserData } from "../../Auth/store/api";
import { selectDiscussions, selectProposals } from "./selectors";
import { ProposalsTypes } from "@/shared/constants";
import { store } from "@/shared/appConfig";
import { ImmediateContributionResponse } from "../interfaces";
import { groupBy, isError } from "@/shared/utils";
import { Awaited } from "@/shared/interfaces";
import {
  AssignCircle,
  CalculatedVotes,
  FundsAllocation,
  MemberAdmittance,
  RemoveCircle,
} from "@/shared/models/governance/proposals";

export function* createGovernance(
  action: ReturnType<typeof actions.createGovernance.request>
): Generator {
  try {
    yield put(startLoading());
    yield createGovernanceApi(action.payload.payload);

    yield put(actions.createGovernance.success());
    action.payload.callback(null);
    yield put(stopLoading());
  } catch (error) {
    if (isError(error)) {
      yield put(actions.createGovernance.failure(error));
      action.payload.callback(error);
      yield put(stopLoading());
    }
  }
}

export function* getCommonsList(): Generator {
  try {
    yield put(startLoading());
    const commons = (yield call(fetchCommonList)) as Common[];

    const cIds = commons.map((c) => c.id);

    const [discussions, proposals, messages] = (yield Promise.all([
      fetchDiscussionForCommonList(cIds),
      fetchProposalsForCommonList(cIds),
      fetchMessagesForCommonList(cIds),
    ])) as [Discussion[], Proposal[], DiscussionMessage[]];

    const discussionGrouped = groupBy<Discussion>(
      discussions,
      (item: Discussion) => item.commonId
    );
    const proposalGrouped = groupBy<Proposal>(
      proposals,
      (item: Proposal) => item.data.args.commonId
    );

    const messagesGrouped = groupBy<DiscussionMessage>(
      messages,
      (item: DiscussionMessage) => item.commonId
    );

    const data = commons.map((c) => {
      c.proposals = proposalGrouped.get(c.id) ?? [];
      c.discussions = discussionGrouped.get(c.id) ?? [];
      c.messages = messagesGrouped.get(c.id) ?? [];

      c.proposals = c.proposals?.filter(
        (e) => e.type === ProposalsTypes.FUNDS_ALLOCATION
      );

      return c;
    });

    yield put(actions.getCommonsList.success(data));
    yield put(stopLoading());
  } catch (e) {
    console.error(e);

    if (isError(e)) {
      yield put(actions.getCommonsList.failure(e));
      yield put(stopLoading());
    }
  }
}

export function* getCommonsListByIds({
  payload,
}: ReturnType<typeof actions.getCommonsListByIds.request>): Generator {
  try {
    const commons = (yield call(
      fetchCommonListByIdsApi,
      payload.payload
    )) as Common[];

    yield put(actions.getCommonsListByIds.success(commons));

    if (payload.callback) {
      payload.callback(null, commons);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getCommonsListByIds.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  }
}

export function* getCommonDetail({
  payload,
}: ReturnType<typeof actions.getCommonDetail.request>): Generator {
  try {
    const commonId = payload.payload;

    yield put(startLoading());
    const common = (yield call(fetchCommonDetail, commonId)) as Common | null;

    if (!common) {
      throw new Error(`Common with id = "${commonId}" was not found`);
    }
    if (!common.governanceId) {
      throw new Error(
        `Common with id = "${commonId}" doesn't have specified governance id`
      );
    }

    const [governance, discussions, proposals] = (yield Promise.all([
      getGovernanceApi(common.governanceId),
      fetchCommonDiscussions(common.id),
      fetchCommonProposals(common.id),
    ])) as [
        Awaited<ReturnType<typeof getGovernanceApi>>,
        Awaited<ReturnType<typeof fetchCommonDiscussions>>,
        Awaited<ReturnType<typeof fetchCommonProposals>>
      ];

    if (!governance) {
      throw new Error(
        `Governance with id = "${common.governanceId}" was not found`
      );
    }

    yield put(actions.getCommonDetail.success(common));
    yield put(actions.setDiscussion(discussions));
    yield put(actions.setProposals(proposals));
    yield put(actions.getGovernance.success(governance));

    if (payload.callback) {
      payload.callback(null, common);
    }
  } catch (e) {
    if (isError(e)) {
      yield put(actions.getCommonDetail.failure(e));

      if (payload.callback) {
        payload.callback(e);
      }
    }
  } finally {
    yield put(stopLoading());
  }
}

export function* loadCommonDiscussionList(): Generator {
  try {
    yield put(startLoading());
    const discussions: Discussion[] = (yield select(
      selectDiscussions()
    )) as Discussion[];

    const ownerIds = Array.from(new Set(discussions.map((d) => d.ownerId)));
    const discussions_ids = discussions.map((d) => d.id);

    const owners = (yield fetchOwners(ownerIds)) as User[];
    const dMessages = (yield fetchDiscussionsMessages(
      discussions_ids
    )) as DiscussionMessage[];

    const loadedDiscussions = discussions.map((d) => {
      const newDiscussion = { ...d };
      newDiscussion.discussionMessage = dMessages.filter((dM) => dM.discussionId === d.id);
      newDiscussion.owner = owners.find((o) => o.uid === d.ownerId);
      return newDiscussion;
    });

    yield put(actions.loadCommonDiscussionList.success(loadedDiscussions));
    yield put(stopLoading());
  } catch (e) {
    if (isError(e)) {
      yield put(actions.loadCommonDiscussionList.failure(e));
      yield put(stopLoading());
    }
  }
}

export function* loadDiscussionDetail(
  action: ReturnType<typeof actions.loadDisscussionDetail.request>
): Generator {
  try {
    yield put(startLoading());
    const discussion = { ...action.payload };

    let discussionMessage: DiscussionMessage[];

    if (action.payload.discussionMessage?.length) {
      discussionMessage = action.payload.discussionMessage;
    } else {
      discussionMessage = (yield fetchDiscussionsMessages([
        discussion.id,
      ])) as DiscussionMessage[];
    }

    const ownerIds = Array.from(
      new Set(discussionMessage?.map((d) => d.ownerId))
    );

    const owners = (yield fetchOwners(ownerIds)) as User[];

    const loadedDisscussionMessage = discussionMessage?.map((d) => {
      const newDiscussionMessage = { ...d };
      newDiscussionMessage.owner = owners.find((o) => o.uid === d.ownerId);
      return newDiscussionMessage;
    });

    discussion.discussionMessage = loadedDisscussionMessage;

    yield put(actions.loadDisscussionDetail.success(discussion));
    yield put(stopLoading());
  } catch (e) {
    if (isError(e)) {
      yield put(actions.loadDisscussionDetail.failure(e));
      yield put(stopLoading());
    }
  }
}

export function* loadProposalList(): Generator {
  try {
    yield put(startLoading());

    const proposals: Proposal[] = (yield select(
      selectProposals()
    )) as Proposal[];

    const ownerIds = Array.from(
      new Set(proposals.map((d) => d.data.args.proposerId))
    );
    const discussions_ids = proposals.map((d) => d.id);

    const owners = (yield fetchOwners(ownerIds)) as User[];
    const dMessages = (yield fetchDiscussionsMessages(
      discussions_ids
    )) as DiscussionMessage[];

    const loadedProposals = proposals.map((d) => {
      const newProposal = { ...d };
      newProposal.discussionMessage = dMessages.filter((dM) => dM.discussionId === d.id);
      newProposal.proposer = owners.find((o) => o.uid === d.data.args.proposerId);
      return newProposal;
    });

    yield put(actions.loadProposalList.success(loadedProposals));
    yield put(stopLoading());
  } catch (e) {
    if (isError(e)) {
      yield put(actions.loadProposalList.failure(e));
      yield put(stopLoading());
    }
  }
}

export function* loadProposalDetail(
  action: ReturnType<typeof actions.loadProposalDetail.request>
): Generator {
  try {
    yield put(startLoading());

    const proposal = { ...action.payload };

    let discussionMessage: DiscussionMessage[];

    if (action.payload.discussionMessage?.length) {
      discussionMessage = action.payload.discussionMessage;
    } else {
      discussionMessage = (yield fetchDiscussionsMessages([
        proposal.id,
      ])) as DiscussionMessage[];
    }

    const ownerIds = Array.from(
      new Set(discussionMessage?.map((d) => d.ownerId))
    );
    const owners = (yield fetchOwners(ownerIds)) as User[];
    const loadedDisscussionMessage = discussionMessage?.map((d) => {
      const newDiscussionMessage = { ...d };
      newDiscussionMessage.owner = owners.find((o) => o.uid === d.ownerId);
      return newDiscussionMessage;
    });
    proposal.discussionMessage = loadedDisscussionMessage;

    proposal.proposer = (yield getUserData(action.payload.data.args.proposerId)) as User;

    yield put(actions.loadProposalDetail.success(proposal));
    yield put(stopLoading());
  } catch (e) {
    if (isError(e)) {
      yield put(actions.loadProposalDetail.failure(e));
      yield put(stopLoading());
    }
  }
}

export function* loadUserProposalList(
  action: ReturnType<typeof actions.loadUserProposalList.request>
): Generator {
  try {
    yield put(startLoading());
    const proposals = (yield fetchUserProposals(action.payload)) as Proposal[];
    const proposer = (yield getUserData(action.payload)) as User;
    const discussions_ids = proposals.map((proposal) => proposal.id);
    const discussionMessages = (yield fetchDiscussionsMessages(
      discussions_ids
    )) as DiscussionMessage[];

    const getProposalMessages = (proposal: Proposal) =>
      discussionMessages.filter(
        (dMessage: DiscussionMessage) => dMessage.discussionId === proposal.id
      );

    const processedUserProposals = proposals.map((proposal) => ({
      ...proposal,
      proposer,
      discussionMessage: getProposalMessages(proposal),
    }));

    yield put(actions.loadUserProposalList.success(processedUserProposals));
    yield put(stopLoading());
  } catch (e) {
    if (isError(e)) {
      yield put(actions.loadUserProposalList.failure(e));
      yield put(stopLoading());
    }
  }
}

export function* createDiscussionSaga(
  action: ReturnType<typeof actions.createDiscussion.request>
): Generator {
  try {
    yield put(startLoading());

    yield createDiscussion(action.payload.payload);

    const unsubscribe = (yield call(
      subscribeToCommonDiscussion,
      action.payload.payload.commonId,
      async (data) => {
        unsubscribe();

        const d = data.find(
          (d: Discussion) => d.title === action.payload.payload.title
        );

        if (d) {
          d.owner = store.getState().auth.user;
          action.payload.callback(d);
        }

        const ds = await fetchCommonDiscussions(
          action.payload.payload.commonId
        );

        store.dispatch(actions.setDiscussion(ds));
        store.dispatch(actions.loadCommonDiscussionList.request());
        store.dispatch(actions.getCommonsList.request());
      }
    )) as () => void;

    yield put(stopLoading());
  } catch (e) {
    if (isError(e)) {
      yield put(actions.createDiscussion.failure(e));
      yield put(stopLoading());
    }
  }
}

export function* addMessageToDiscussionSaga(
  action: ReturnType<typeof actions.addMessageToDiscussion.request>
): Generator {
  try {
    yield put(startLoading());

    yield addMessageToDiscussion(action.payload.payload);

    yield call(
      subscribeToMessages,
      action.payload.payload.discussionId,
      async (data) => {
        const { discussion } = action.payload;

        const updatedDiscussion = {
          ...discussion,
          discussionMessage: data.sort(
            (m: DiscussionMessage, mP: DiscussionMessage) =>
              m.createTime?.seconds - mP.createTime?.seconds
          ),
        };

        store.dispatch(actions.loadDisscussionDetail.request(updatedDiscussion));
        store.dispatch(actions.getCommonsList.request());
      }
    );

    yield put(stopLoading());
  } catch (e) {
    if (isError(e)) {
      yield put(actions.addMessageToDiscussion.failure(e));
      yield put(stopLoading());
    }
  }
}

export function* addMessageToProposalSaga(
  action: ReturnType<typeof actions.addMessageToProposal.request>
): Generator {
  try {
    yield put(startLoading());

    yield addMessageToDiscussion(action.payload.payload);

    yield call(
      subscribeToMessages,
      action.payload.payload.discussionId,
      async (data) => {
        const proposal = { ...action.payload.proposal };

        const updatedProposal = {
          ...proposal,
          discussionMessage: data.sort(
            (m: DiscussionMessage, mP: DiscussionMessage) =>
              m.createTime?.seconds - mP.createTime?.seconds
          ),
        };

        store.dispatch(actions.loadProposalDetail.request(updatedProposal));

        store.dispatch(actions.getCommonsList.request());
      }
    );

    yield put(stopLoading());
  } catch (e) {
    if (isError(e)) {
      yield put(actions.addMessageToProposal.failure(e));
      yield put(stopLoading());
    }
  }
}

export function* createMemberAdmittanceProposal({
  payload,
}: ReturnType<
  typeof actions.createMemberAdmittanceProposal.request
>): Generator {
  try {
    yield put(startLoading());
    const memberAdmittanceProposal = (yield call(createProposalApi, {
      ...payload.payload,
      type: ProposalsTypes.MEMBER_ADMITTANCE,
    })) as MemberAdmittance;

    yield put(
      actions.createMemberAdmittanceProposal.success(memberAdmittanceProposal)
    );

    if (payload.callback) {
      payload.callback(null, memberAdmittanceProposal);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.createMemberAdmittanceProposal.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  } finally {
    yield put(stopLoading());
  }
}

export function* createAssignCircleProposal({
  payload,
}: ReturnType<typeof actions.createAssignCircleProposal.request>): Generator {
  try {
    yield put(startLoading());
    const assignCircleProposal = (yield call(createProposalApi, {
      ...payload.payload,
      type: ProposalsTypes.ASSIGN_CIRCLE,
    })) as AssignCircle;

    yield put(actions.createAssignCircleProposal.success(assignCircleProposal));

    if (payload.callback) {
      payload.callback(null, assignCircleProposal);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.createAssignCircleProposal.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  } finally {
    yield put(stopLoading());
  }
}

export function* createRemoveCircleProposal({
  payload,
}: ReturnType<typeof actions.createRemoveCircleProposal.request>): Generator {
  try {
    yield put(startLoading());
    const removeCircleProposal = (yield call(createProposalApi, {
      ...payload.payload,
      type: ProposalsTypes.REMOVE_CIRCLE
    })) as RemoveCircle;

    yield put(actions.createRemoveCircleProposal.success(removeCircleProposal));

    if (payload.callback) {
      payload.callback(null, removeCircleProposal);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.createRemoveCircleProposal.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  } finally {
    yield put(stopLoading());
  }
}

export function* createFundingProposal(
  action: ReturnType<typeof actions.createFundingProposal.request>
): Generator {
  try {
    const data = action.payload.payload;
    const { commonId } = data.args;

    yield put(startLoading());
    const fundingProposal = (yield call(createProposalApi, {
      ...data,
      type: ProposalsTypes.FUNDS_ALLOCATION,
    })) as FundsAllocation;

    yield call(
      subscribeToCommonProposal,
      commonId,
      async () => {
        const ds = await fetchCommonProposals(commonId);

        store.dispatch(actions.setProposals(ds));
        store.dispatch(actions.loadProposalList.request());
        store.dispatch(stopLoading());
        action.payload.callback(null);
        store.dispatch(actions.getCommonsList.request());
      }
    );

    yield put(actions.createFundingProposal.success(fundingProposal));
    yield put(stopLoading());
  } catch (error) {
    if (isError(error)) {
      let errorMessage = "";

      if (
        isRequestError(error) &&
        error.response?.data?.errorCode === ErrorCode.SellerRejected
      ) {
        errorMessage =
          "Your bank account details couldn’t be verified. Please update them in your account settings.";
      }

      action.payload.callback(errorMessage);
      yield put(actions.createFundingProposal.failure(error));
      yield put(stopLoading());
    }
  }
}

export function* leaveCommon(
  action: ReturnType<typeof actions.leaveCommon.request>
): Generator {
  try {
    yield put(startLoading());
    yield leaveCommonApi(action.payload.payload);

    yield put(actions.leaveCommon.success(action.payload.payload.commonId));
    action.payload.callback(null);
    yield put(stopLoading());
  } catch (error) {
    if (isError(error)) {
      yield put(actions.leaveCommon.failure(error));
      action.payload.callback(error);
      yield put(stopLoading());
    }
  }
}

export function* deleteCommon(
  action: ReturnType<typeof actions.deleteCommon.request>
): Generator {
  try {
    yield put(startLoading());
    yield deleteCommonApi(action.payload.payload);

    yield put(actions.deleteCommon.success(action.payload.payload.commonId));
    action.payload.callback(null);
    yield put(stopLoading());
  } catch (error) {
    if (isError(error)) {
      yield put(actions.deleteCommon.failure(error));
      action.payload.callback(error);
      yield put(stopLoading());
    }
  }
}

async function waitForVoteToBeApplied(
  commonId: string,
  proposalId: string,
  proposalVotes: CalculatedVotes
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    try {
      const unsubscribe = subscribeToProposal(proposalId, async (proposal) => {
        if (
          (proposal.votes.approved === proposalVotes.approved &&
            proposal.votes.rejected === proposalVotes.rejected &&
            proposal.votes.abstained === proposalVotes.abstained) ||
          proposal.votes.total < proposalVotes.total
        ) {
          return;
        }

        try {
          const proposals = await fetchCommonProposals(commonId);
          store.dispatch(actions.setProposals(proposals));
          store.dispatch(actions.loadProposalList.request());
          store.dispatch(
            actions.loadProposalDetail.request(
              proposals.filter((p) => p.id === proposalId)[0]
            )
          );
          store.dispatch(stopLoading());
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          unsubscribe();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function* createVote({
  payload,
}: ReturnType<typeof actions.createVote.request>): Generator {
  const {
    votePayload,
    proposalVotes,
    shouldWaitForVoteToBeApplied = true,
  } = payload.payload;

  try {
    yield put(startLoading());
    const vote = (yield createVoteApi(votePayload)) as Vote;

    if (shouldWaitForVoteToBeApplied) {
      yield call(async () => {
        await waitForVoteToBeApplied(
          vote.commonId,
          vote.proposalId,
          proposalVotes
        );
      });
    }
    yield put(actions.createVote.success());
    payload.callback(null, vote);
    yield put(stopLoading());
  } catch (error) {
    if (isError(error)) {
      yield put(actions.createVote.failure(error));
      payload.callback(error);
      yield put(stopLoading());
    }
  }
}

export function* updateVote({
  payload,
}: ReturnType<typeof actions.updateVote.request>): Generator {
  const { votePayload, proposalVotes } = payload.payload;

  try {
    yield put(startLoading());
    const vote = (yield updateVoteApi(votePayload)) as Vote;

    yield call(async () => {
      await waitForVoteToBeApplied(
        vote.commonId,
        vote.proposalId,
        proposalVotes
      );
    });

    yield put(actions.updateVote.success());
    payload.callback(null, vote);
    yield put(stopLoading());
  } catch (error) {
    if (isError(error)) {
      yield put(actions.updateVote.failure(error));
      payload.callback(error);
      yield put(stopLoading());
    }
  }
}

export function* getBankDetails(
  action: ReturnType<typeof actions.getBankDetails.request>
): Generator {
  try {
    yield put(startLoading());
    const bankAccountDetails = (yield getBankDetailsApi()) as BankAccountDetails;

    yield put(actions.getBankDetails.success(bankAccountDetails));
    action.payload.callback(null, bankAccountDetails);
    yield put(stopLoading());
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getBankDetails.failure(error));
      action.payload.callback(error);
      yield put(stopLoading());
    }
  }
}

export function* addBankDetails(
  action: ReturnType<typeof actions.addBankDetails.request>
): Generator {
  try {
    yield put(startLoading());
    const bankAccountDetails = (yield addBankDetailsApi(
      action.payload.payload
    )) as BankAccountDetails;

    yield put(actions.addBankDetails.success(bankAccountDetails));
    action.payload.callback(null, bankAccountDetails);
    yield put(stopLoading());
  } catch (error) {
    if (isError(error)) {
      yield put(actions.addBankDetails.failure(error));
      action.payload.callback(error);
      yield put(stopLoading());
    }
  }
}

export function* updateBankDetails(
  action: ReturnType<typeof actions.updateBankDetails.request>
): Generator {
  try {
    yield put(startLoading());
    yield updateBankDetailsApi(action.payload.payload);
    const bankAccountDetails = (yield getBankDetailsApi()) as BankAccountDetails;

    yield put(actions.updateBankDetails.success(bankAccountDetails));
    action.payload.callback(null, bankAccountDetails);
    yield put(stopLoading());
  } catch (error) {
    if (isError(error)) {
      yield put(actions.updateBankDetails.failure(error));
      action.payload.callback(error);
      yield put(stopLoading());
    }
  }
}

export function* deleteBankDetails(
  action: ReturnType<typeof actions.deleteBankDetails.request>
): Generator {
  try {
    yield put(startLoading());

    const bankAccountDetails = (yield deleteBankDetailsApi()) as BankAccountDetails;

    yield put(actions.deleteBankDetails.success(bankAccountDetails));
    action.payload.callback(null, bankAccountDetails);

    yield put(stopLoading());
  } catch (error) {
    if (isError(error)) {
      yield put(actions.deleteBankDetails.failure(error));
      action.payload.callback(error);

      yield put(stopLoading());
    }
  }
}

export function* loadUserCardsSaga(
  action: ReturnType<typeof actions.loadUserCards.request>
): Generator {
  try {
    const { user } = store.getState().auth;
    if (user && user.uid) {
      yield put(startLoading());

      const cards = (yield loadUserCards(user.uid)) as Card[];

      yield put(actions.loadUserCards.success(cards));
      action.payload.callback(null, cards);

      yield put(stopLoading());
    }
  } catch (e) {
    if (isError(e)) {
      yield put(actions.loadUserCards.failure(e));
      yield put(stopLoading());
    }
  }
}

export function* createCommon(
  action: ReturnType<typeof actions.createCommon.request>
): Generator {
  try {
    const common = (yield call(
      createCommonApi,
      action.payload.payload
    )) as Awaited<ReturnType<typeof createCommonApi>>;

    // const governanceCreationPayload = createDefaultGovernanceCreationPayload({
    //   unstructuredRules: rules || [],
    //   commonId: common.id,
    // });
    //
    // yield call(
    //   createGovernanceApi,
    //   governanceCreationPayload
    // );
    //
    // yield call(addFounderToMembersApi, {
    //   commonId: common.id,
    //   circles: governanceCreationPayload.circles.map((circle, index) => index),
    // });

    yield put(actions.createCommon.success(common));
    action.payload.callback(null, common);
  } catch (error) {
    if (isError(error)) {
      yield put(actions.createCommon.failure(error));
      action.payload.callback(error);
    }
  }
}

export function* makeImmediateContribution(
  action: ReturnType<typeof actions.makeImmediateContribution.request>
): Generator {
  try {
    const response = (yield call(
      makeImmediateContributionApi,
      action.payload.payload
    )) as ImmediateContributionResponse;

    yield put(actions.makeImmediateContribution.success(response));
    action.payload.callback(null, response);
  } catch (error) {
    if (isError(error)) {
      yield put(actions.makeImmediateContribution.failure(error));
      action.payload.callback(error);
    }
  }
}

export function* createBuyerTokenPage(
  action: ReturnType<typeof actions.createBuyerTokenPage.request>
): Generator {
  try {
    const response = (yield call(
      PayMeService.createBuyerTokenPage,
      action.payload.payload
    )) as CommonPayment;

    yield put(actions.createBuyerTokenPage.success(response));
    action.payload.callback(null, response);
  } catch (error) {
    if (isError(error)) {
      yield put(actions.createBuyerTokenPage.failure(error));
      action.payload.callback(error);
    }
  }
}

export function* getUserContributionsToCommon(
  action: ReturnType<typeof actions.getUserContributionsToCommon.request>
): Generator {
  try {
    const payments = (yield call(
      getUserContributionsToCommonApi,
      action.payload.payload.commonId,
      action.payload.payload.userId
    )) as Payment[];

    yield put(actions.getUserContributionsToCommon.success(payments));
    action.payload.callback(null, payments);
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getUserContributionsToCommon.failure(error));
      action.payload.callback(error);
    }
  }
}

export function* getUserContributions(
  action: ReturnType<typeof actions.getUserContributions.request>
): Generator {
  try {
    const payments = (yield call(
      getUserContributionsApi,
      action.payload.payload
    )) as Payment[];

    yield put(actions.getUserContributions.success(payments));
    action.payload.callback(null, payments);
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getUserContributions.failure(error));
      action.payload.callback(error);
    }
  }
}

export function* getUserSubscriptionToCommon(
  action: ReturnType<typeof actions.getUserSubscriptionToCommon.request>
): Generator {
  try {
    const subscription = (yield call(
      getUserSubscriptionToCommonApi,
      action.payload.payload.commonId,
      action.payload.payload.userId
    )) as Subscription | null;

    yield put(actions.getUserSubscriptionToCommon.success(subscription));
    action.payload.callback(null, subscription);
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getUserSubscriptionToCommon.failure(error));
      action.payload.callback(error);
    }
  }
}

export function* getUserSubscriptions(
  action: ReturnType<typeof actions.getUserSubscriptions.request>
): Generator {
  try {
    const subscriptions = (yield call(
      getUserSubscriptionsApi,
      action.payload.payload
    )) as Subscription[];

    yield put(actions.getUserSubscriptions.success(subscriptions));
    action.payload.callback(null, subscriptions);
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getUserSubscriptions.failure(error));
      action.payload.callback(error);
    }
  }
}

export function* updateSubscription({
  payload,
}: ReturnType<typeof actions.updateSubscription.request>): Generator {
  try {
    yield call(updateSubscriptionApi, payload.payload);
    const subscription = (yield call(
      getSubscriptionById,
      payload.payload.subscriptionId
    )) as Subscription;

    yield put(actions.updateSubscription.success(subscription));
    payload.callback(null, subscription);
  } catch (error) {
    if (isError(error)) {
      yield put(actions.updateSubscription.failure(error));
      payload.callback(error);
    }
  }
}

export function* cancelSubscription({
  payload,
}: ReturnType<typeof actions.cancelSubscription.request>): Generator {
  try {
    yield call(cancelSubscriptionApi, payload.payload);
    const subscription = (yield call(
      getSubscriptionById,
      payload.payload
    )) as Subscription;

    yield put(actions.cancelSubscription.success(subscription));
    payload.callback(null, subscription);
  } catch (error) {
    if (isError(error)) {
      yield put(actions.cancelSubscription.failure(error));
      payload.callback(error);
    }
  }
}

export function* getGovernance({
  payload,
}: ReturnType<typeof actions.getGovernance.request>): Generator {
  try {
    const governanceId = payload.payload;

    yield put(startLoading());
    const governance = (yield call(getGovernanceApi, governanceId)) as Awaited<
      ReturnType<typeof getGovernanceApi>
    >;

    if (!governance) {
      throw new Error(`Governance with id = "${governanceId}" was not found`);
    }

    yield put(actions.getGovernance.success(governance));

    if (payload.callback) {
      payload.callback(null, governance);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getGovernance.failure(error));
      if (payload.callback) {
        payload.callback(error);
      }
    }
  } finally {
    yield put(stopLoading());
  }
}

export function* getCommonMember({
  payload,
}: ReturnType<typeof actions.getCommonMember.request>): Generator {
  try {
    const { commonId, userId } = payload.payload;

    yield put(startLoading());
    const commonMember = (yield call(
      getCommonMemberApi,
      commonId,
      userId
    )) as Awaited<ReturnType<typeof getCommonMemberApi>>;

    if (!commonMember) {
      throw new Error(
        `Member for commonId = "${commonId}" and userId = "${userId}" was not found`
      );
    }

    yield put(actions.getCommonMember.success(commonMember));

    if (payload.callback) {
      payload.callback(null, commonMember);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getCommonMember.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  } finally {
    yield put(stopLoading());
  }
}

export function* getCommonMembers({
  payload,
}: ReturnType<typeof actions.getCommonMembers.request>): Generator {
  try {
    yield put(startLoading());
    const commonMembers = (yield call(
      getCommonMembersApi,
      payload.payload
    )) as Awaited<ReturnType<typeof getCommonMembersApi>>;

    yield put(actions.getCommonMembers.success(commonMembers));

    if (payload.callback) {
      payload.callback(null, commonMembers);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getCommonMembers.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  } finally {
    yield put(stopLoading());
  }
}

export function* getUserCommons({
  payload,
}: ReturnType<typeof actions.getUserCommons.request>): Generator {
  try {
    const userId = payload.payload;

    yield put(startLoading());
    const commons = (yield call(getUserCommonsApi, userId)) as Awaited<
      ReturnType<typeof getUserCommonsApi>
    >;

    yield put(actions.getUserCommons.success(commons));

    if (payload.callback) {
      payload.callback(null, commons);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getUserCommons.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  } finally {
    yield put(stopLoading());
  }
}

export function* commonsSaga() {
  yield takeLatest(actions.createGovernance.request, createGovernance);
  yield takeLatest(actions.getCommonsList.request, getCommonsList);
  yield takeLatest(actions.getCommonsListByIds.request, getCommonsListByIds);
  yield takeLatest(actions.getCommonDetail.request, getCommonDetail);
  yield takeLatest(
    actions.loadCommonDiscussionList.request,
    loadCommonDiscussionList
  );
  yield takeLatest(actions.loadDisscussionDetail.request, loadDiscussionDetail);
  yield takeLatest(actions.loadProposalList.request, loadProposalList);
  yield takeLatest(actions.loadProposalDetail.request, loadProposalDetail);
  yield takeLatest(actions.loadUserProposalList.request, loadUserProposalList);
  yield takeLatest(actions.createDiscussion.request, createDiscussionSaga);
  yield takeLatest(
    actions.addMessageToDiscussion.request,
    addMessageToDiscussionSaga
  );
  yield takeLatest(
    actions.createMemberAdmittanceProposal.request,
    createMemberAdmittanceProposal
  );
  yield takeLatest(
    actions.createAssignCircleProposal.request,
    createAssignCircleProposal
  );
  yield takeLatest(
    actions.createRemoveCircleProposal.request,
    createRemoveCircleProposal
  );
  yield takeLatest(actions.leaveCommon.request, leaveCommon);
  yield takeLatest(actions.deleteCommon.request, deleteCommon);
  yield takeLatest(
    actions.createFundingProposal.request,
    createFundingProposal
  );
  yield takeLatest(actions.loadUserCards.request, loadUserCardsSaga);
  yield takeLatest(
    actions.addMessageToProposal.request,
    addMessageToProposalSaga
  );
  yield takeLatest(actions.createCommon.request, createCommon);
  yield takeLatest(actions.createVote.request, createVote);
  yield takeLatest(actions.updateVote.request, updateVote);
  yield takeLatest(
    actions.makeImmediateContribution.request,
    makeImmediateContribution
  );
  yield takeLatest(actions.createBuyerTokenPage.request, createBuyerTokenPage);
  yield takeLatest(actions.getBankDetails.request, getBankDetails);
  yield takeLatest(actions.addBankDetails.request, addBankDetails);
  yield takeLatest(actions.updateBankDetails.request, updateBankDetails);
  yield takeLatest(actions.deleteBankDetails.request, deleteBankDetails);
  yield takeLatest(
    actions.getUserContributionsToCommon.request,
    getUserContributionsToCommon
  );
  yield takeLatest(actions.getUserContributions.request, getUserContributions);
  yield takeLatest(
    actions.getUserSubscriptionToCommon.request,
    getUserSubscriptionToCommon
  );
  yield takeLatest(actions.getUserSubscriptions.request, getUserSubscriptions);
  yield takeLatest(actions.updateSubscription.request, updateSubscription);
  yield takeLatest(actions.cancelSubscription.request, cancelSubscription);
  yield takeLatest(actions.getGovernance.request, getGovernance);
  yield takeLatest(actions.getCommonMember.request, getCommonMember);
  yield takeLatest(actions.getCommonMembers.request, getCommonMembers);
  yield takeLatest(actions.getUserCommons.request, getUserCommons);
}

export default commonsSaga;
