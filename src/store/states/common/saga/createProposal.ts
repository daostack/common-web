import { call, put } from "redux-saga/effects";
import { ProposalService } from "@/services";
import { Awaited } from "@/shared/interfaces";
import { isError } from "@/shared/utils";
import * as cacheActions from "../../cache/actions";
import * as actions from "../actions";

export function* createSurveyProposal(
  action: ReturnType<typeof actions.createSurveyProposal.request>,
): Generator {
  const { payload } = action;

  try {
    const proposal = (yield call(
      ProposalService.createSurveyProposal,
      payload.payload,
    )) as Awaited<ReturnType<typeof ProposalService.createSurveyProposal>>;

    yield put(
      cacheActions.updateProposalStateById({
        proposalId: proposal.id,
        state: {
          loading: false,
          fetched: true,
          data: proposal,
        },
      }),
    );

    yield put(actions.setCommonAction(null));
    yield put(
      actions.createSurveyProposal.success({
        proposal,
        commonId: payload.commonId,
      }),
    );

    if (payload.callback) {
      payload.callback(null, proposal);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(
        actions.createSurveyProposal.failure({
          error,
          commonId: payload.commonId,
        }),
      );

      if (payload.callback) {
        payload.callback(error);
      }
    }
  }
}

export function* createFundingProposal(
  action: ReturnType<typeof actions.createFundingProposal.request>,
): Generator {
  const { payload } = action;

  try {
    const proposal = (yield call(
      ProposalService.createFundingProposal,
      payload.payload,
    )) as Awaited<ReturnType<typeof ProposalService.createFundingProposal>>;

    yield put(
      cacheActions.updateProposalStateById({
        proposalId: proposal.id,
        state: {
          loading: false,
          fetched: true,
          data: proposal,
        },
      }),
    );

    yield put(actions.setCommonAction(null));
    yield put(
      actions.createFundingProposal.success({
        proposal,
        commonId: payload.commonId,
      }),
    );

    if (payload.callback) {
      payload.callback(null, proposal);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(
        actions.createFundingProposal.failure({
          error,
          commonId: payload.commonId,
        }),
      );

      if (payload.callback) {
        payload.callback(error);
      }
    }
  }
}
