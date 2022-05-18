import { call, put, select, takeLatest } from "redux-saga/effects";
import PayMeService from "@/services/PayMeService";
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
  ProposalType,
} from "../../../shared/models";
import { startLoading, stopLoading } from "@/shared/store/actions";
import {
  createCommon as createCommonApi,
  createRequestToJoin as createRequestToJoinApi,
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
  createFundingProposal,
  subscribeToCommonProposal,
  leaveCommon as leaveCommonApi,
  loadUserCards,
  deleteCommon as deleteCommonApi,
  createVote as createVoteApi,
  updateVote as updateVoteApi,
  makeImmediateContribution as makeImmediateContributionApi,
  addBankDetails as addBankDetailsApi,
  updateBankDetails as updateBankDetailsApi,
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
} from "./api";
import { getUserData } from "../../Auth/store/api";
import { selectDiscussions, selectProposals } from "./selectors";
import { store } from "@/shared/appConfig";
import { AddProposalSteps } from "@/containers/Common/components/CommonDetailContainer/AddProposalComponent/AddProposalComponent";
import { Vote } from "@/shared/interfaces/api/vote";
import { CreateGovernance, ImmediateContributionResponse } from "../interfaces";
import { groupBy } from "@/shared/utils";

export function* createGovernance(
  action: ReturnType<typeof actions.createGovernance.request>
): Generator {
  try {
    yield put(startLoading());
    const governance = (yield createGovernanceApi(action.payload.payload)) as CreateGovernance;

    yield put(actions.createGovernance.success(governance));
    action.payload.callback(null);
    yield put(stopLoading());
  } catch (error) {
    yield put(actions.createGovernance.failure(error));
    action.payload.callback(error);
    yield put(stopLoading());
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
      (item: Proposal) => item.commonId
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
        (e) => e.type === ProposalType.FundingRequest
      );

      return c;
    });

    yield put(actions.getCommonsList.success(data));
    yield put(stopLoading());
  } catch (e) {
    console.error(e);
    yield put(actions.getCommonsList.failure(e));
    yield put(stopLoading());
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
    yield put(actions.getCommonsListByIds.failure(error));

    if (payload.callback) {
      payload.callback(error);
    }
  }
}

export function* getCommonDetail({
  payload,
}: ReturnType<typeof actions.getCommonDetail.request>): Generator {
  try {
    yield put(startLoading());
    const common = (yield call(fetchCommonDetail, payload.payload)) as Common;

    const [discussions, proposals] = (yield Promise.all([
      fetchCommonDiscussions(common.id),
      fetchCommonProposals(common.id),
    ])) as any[];

    yield put(actions.getCommonDetail.success(common));
    yield put(actions.setDiscussion(discussions));
    yield put(actions.setProposals(proposals));

    if (payload.callback) {
      payload.callback(null, common);
    }
  } catch (e) {
    yield put(actions.getCommonDetail.failure(e));

    if (payload.callback) {
      payload.callback(e);
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
      d.discussionMessage = dMessages.filter((dM) => dM.discussionId === d.id);
      d.owner = owners.find((o) => o.uid === d.ownerId);
      return d;
    });

    yield put(actions.loadCommonDiscussionList.success(loadedDiscussions));
    yield put(stopLoading());
  } catch (e) {
    yield put(actions.loadCommonDiscussionList.failure(e));
    yield put(stopLoading());
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
      discussionMessage = (yield fetchDiscussionsMessages([discussion.id])) as DiscussionMessage[];
    }

    const ownerIds = Array.from(
      new Set(discussionMessage?.map((d) => d.ownerId))
    );

    const owners = (yield fetchOwners(ownerIds)) as User[];

    const loadedDisscussionMessage = discussionMessage?.map((d) => {
      d.owner = owners.find((o) => o.uid === d.ownerId);
      return d;
    });

    discussion.discussionMessage = loadedDisscussionMessage;

    yield put(actions.loadDisscussionDetail.success(discussion));
    yield put(stopLoading());
  } catch (e) {
    yield put(actions.loadDisscussionDetail.failure(e));
    yield put(stopLoading());
  }
}

export function* loadProposalList(
  action: ReturnType<typeof actions.loadProposalList.request>
): Generator {
  try {
    yield put(startLoading());

    const proposals: Proposal[] = (yield select(
      selectProposals()
    )) as Proposal[];

    const ownerIds = Array.from(new Set(proposals.map((d) => d.proposerId)));
    const discussions_ids = proposals.map((d) => d.id);

    const owners = (yield fetchOwners(ownerIds)) as User[];
    const dMessages = (yield fetchDiscussionsMessages(
      discussions_ids
    )) as DiscussionMessage[];

    const loadedProposals = proposals.map((d) => {
      d.discussionMessage = dMessages.filter((dM) => dM.discussionId === d.id);
      d.proposer = owners.find((o) => o.uid === d.proposerId);
      return d;
    });

    yield put(actions.loadProposalList.success(loadedProposals));
    yield put(stopLoading());
  } catch (e) {
    yield put(actions.loadProposalList.failure(e));
    yield put(stopLoading());
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
      discussionMessage = (yield fetchDiscussionsMessages([proposal.id])) as DiscussionMessage[];
    }

    const ownerIds = Array.from(
      new Set(discussionMessage?.map((d) => d.ownerId))
    );
    const owners = (yield fetchOwners(ownerIds)) as User[];
    const loadedDisscussionMessage = discussionMessage?.map((d) => {
      d.owner = owners.find((o) => o.uid === d.ownerId);
      return d;
    });
    proposal.discussionMessage = loadedDisscussionMessage;

    yield put(actions.loadProposalDetail.success(proposal));
    yield put(stopLoading());
  } catch (e) {
    yield put(actions.loadProposalDetail.failure(e));
    yield put(stopLoading());
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
    yield put(actions.loadUserProposalList.failure(e));
    yield put(stopLoading());
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
    yield put(actions.createDiscussion.failure(e));
    yield put(stopLoading());
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

        discussion.discussionMessage = data.sort(
          (m: DiscussionMessage, mP: DiscussionMessage) =>
            m.createTime?.seconds - mP.createTime?.seconds
        );
        store.dispatch(actions.loadDisscussionDetail.request(discussion));
        store.dispatch(actions.getCommonsList.request());
      }
    );

    yield put(stopLoading());
  } catch (e) {
    yield put(actions.addMessageToDiscussion.failure(e));
    yield put(stopLoading());
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
        const { proposal } = action.payload;

        proposal.discussionMessage = data.sort(
          (m: DiscussionMessage, mP: DiscussionMessage) =>
            m.createTime?.seconds - mP.createTime?.seconds
        );

        store.dispatch(actions.loadProposalDetail.request(proposal));
        store.dispatch(actions.getCommonsList.request());
      }
    );

    yield put(stopLoading());
  } catch (e) {
    yield put(actions.addMessageToProposal.failure(e));
    yield put(stopLoading());
  }
}

export function* createRequestToJoin(
  action: ReturnType<typeof actions.createRequestToJoin.request>
): Generator {
  try {
    yield put(startLoading());
    const proposal = (yield createRequestToJoinApi(action.payload)) as Proposal;

    yield put(actions.createRequestToJoin.success(proposal));
    yield put(stopLoading());
  } catch (error) {
    yield put(actions.createRequestToJoin.failure(error));
    yield put(stopLoading());
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
    yield put(actions.leaveCommon.failure(error));
    action.payload.callback(error);
    yield put(stopLoading());
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
    yield put(actions.deleteCommon.failure(error));
    action.payload.callback(error);
    yield put(stopLoading());
  }
}

export function* createVote(
  action: ReturnType<typeof actions.createVote.request>
): Generator {
  try {
    yield put(startLoading());
    const vote = (yield createVoteApi(action.payload.payload)) as Vote;

    yield call(async () => {
      const proposals = await fetchCommonProposals(vote.commonId);
      store.dispatch(actions.setProposals(proposals));
      store.dispatch(actions.loadProposalList.request());
      store.dispatch(
        actions.loadProposalDetail.request(
          proposals.filter((p) => p.id === action.payload.payload.proposalId)[0]
        )
      );
      store.dispatch(stopLoading());
    });
    yield put(actions.createVote.success());
    action.payload.callback(null);
    yield put(stopLoading());
  } catch (error) {
    yield put(actions.createVote.failure(error));
    action.payload.callback(error);
    yield put(stopLoading());
  }
}

export function* updateVote(
  action: ReturnType<typeof actions.updateVote.request>
): Generator {
  try {
    yield put(startLoading());
    const vote = (yield updateVoteApi(action.payload.payload)) as Vote;

    yield call(async () => {
      const proposals = await fetchCommonProposals(vote.commonId);

      store.dispatch(actions.setProposals(proposals));

      store.dispatch(actions.loadProposalList.request());

      store.dispatch(
        actions.loadProposalDetail.request(
          proposals.find(
            (proposal) => proposal.id === vote.proposalId
          ) as Proposal
        )
      );
    });

    yield put(actions.updateVote.success());
    action.payload.callback(null);
    yield put(stopLoading());
  } catch (error) {
    yield put(actions.updateVote.failure(error));
    action.payload.callback(error);
    yield put(stopLoading());
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
    yield put(actions.getBankDetails.failure(error));
    action.payload.callback(error);
    yield put(stopLoading());
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
    yield put(actions.addBankDetails.failure(error));
    action.payload.callback(error);
    yield put(stopLoading());
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
    yield put(actions.updateBankDetails.failure(error));
    action.payload.callback(error);
    yield put(stopLoading());
  }
}

export function* createFundingProposalSaga(
  action: ReturnType<typeof actions.createFundingProposal.request>
): Generator {
  try {
    yield put(startLoading());
    const proposal = (yield createFundingProposal(
      action.payload.payload
    )) as Proposal;

    yield call(
      subscribeToCommonProposal,
      action.payload.payload.commonId,
      async (data) => {
        const ds = await fetchCommonProposals(action.payload.payload.commonId);

        store.dispatch(actions.setProposals(ds));
        store.dispatch(actions.loadProposalList.request());
        store.dispatch(stopLoading());
        action.payload.callback(AddProposalSteps.SUCCESS);
        store.dispatch(actions.getCommonsList.request());
      }
    );

    yield put(actions.createFundingProposal.success(proposal));
    yield put(stopLoading());
  } catch (error) {
    action.payload.callback(AddProposalSteps.FAILURE);
    yield put(actions.createFundingProposal.failure(error));
    yield put(stopLoading());
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
    yield put(actions.loadUserCards.failure(e));
    yield put(stopLoading());
  }
}

export function* createCommon(
  action: ReturnType<typeof actions.createCommon.request>
): Generator {
  try {
    const common = (yield call(
      createCommonApi,
      action.payload.payload
    )) as Common;

    yield put(actions.createCommon.success(common));
    action.payload.callback(null, common);
  } catch (error) {
    yield put(actions.createCommon.failure(error));
    action.payload.callback(error);
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
    yield put(actions.makeImmediateContribution.failure(error));
    action.payload.callback(error);
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
    yield put(actions.createBuyerTokenPage.failure(error));
    action.payload.callback(error);
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
    yield put(actions.getUserContributionsToCommon.failure(error));
    action.payload.callback(error);
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
    yield put(actions.getUserContributions.failure(error));
    action.payload.callback(error);
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
    yield put(actions.getUserSubscriptionToCommon.failure(error));
    action.payload.callback(error);
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
    yield put(actions.getUserSubscriptions.failure(error));
    action.payload.callback(error);
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
    yield put(actions.updateSubscription.failure(error));
    payload.callback(error);
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
    yield put(actions.cancelSubscription.failure(error));
    payload.callback(error);
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
  yield takeLatest(actions.createRequestToJoin.request, createRequestToJoin);
  yield takeLatest(actions.leaveCommon.request, leaveCommon);
  yield takeLatest(actions.deleteCommon.request, deleteCommon);
  yield takeLatest(
    actions.createFundingProposal.request,
    createFundingProposalSaga
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
}

export default commonsSaga;
