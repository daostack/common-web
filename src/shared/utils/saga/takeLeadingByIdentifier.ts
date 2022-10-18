import { Action } from "redux";
import { call, fork, take, takeLeading } from "redux-saga/effects";
import { ActionPattern } from "@redux-saga/types";
import { HelperWorkerParameters } from "@redux-saga/core/effects";

type Saga = (...args: any[]) => any;

export const takeLeadingByIdentifier = <A extends Action>(
  pattern: ActionPattern<A>,
  identifier: (action: A) => string,
  saga: Saga,
  ...args: HelperWorkerParameters<A, Saga>
) =>
  fork(function* () {
    const tasks = {};

    while (true) {
      const action = yield take(pattern);
      console.log(action);
      const id = identifier(action);

      if (!tasks[id]) {
        yield call(saga, ...args.concat(action));
        tasks[id] = yield takeLeading(
          (patternAction) =>
            patternAction.type === action.type &&
            identifier(patternAction) === id,
          saga,
          ...args
        );
      }
    }
  });
