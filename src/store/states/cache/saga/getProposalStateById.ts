import { call, put, select } from "redux-saga/effects";
import { ProposalService } from "@/services";
import { Awaited, LoadingState } from "@/shared/interfaces";
import { Proposal } from "@/shared/models";
import { isError } from "@/shared/utils";
import * as actions from "../actions";
import { selectProposalStateById } from "../selectors";

const getStateAction = actions.getProposalStateById;
const updateStateAction = actions.updateProposalStateById;
const requestFunction = ProposalService.getProposalById;
const selectState = selectProposalStateById;

type State = LoadingState<Proposal | null>;

export function* getProposalStateById({
  payload,
}: ReturnType<typeof getStateAction.request>) {
  const { proposalId } = payload.payload;

  try {
    const state = ((yield select(selectState(proposalId))) as State) || null;

    if (state?.fetched || state?.loading) {
      return;
    }

    yield put(
      updateStateAction({
        proposalId,
        state: {
          loading: true,
          fetched: false,
          data: null,
        },
      }),
    );
    const data = (yield call(requestFunction, proposalId)) as Awaited<
      ReturnType<typeof requestFunction>
    >;

    yield put(
      updateStateAction({
        proposalId,
        state: {
          loading: false,
          fetched: true,
          data,
        },
      }),
    );
    yield put(getStateAction.success(data));

    if (payload.callback) {
      payload.callback(null, data);
    }
  } catch (error) {
    yield put(
      updateStateAction({
        proposalId,
        state: {
          loading: false,
          fetched: true,
          data: null,
        },
      }),
    );

    if (isError(error)) {
      yield put(getStateAction.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  }
}
