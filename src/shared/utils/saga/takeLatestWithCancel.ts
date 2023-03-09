import { Action } from "redux";
import { fork, race, take } from "redux-saga/effects";
import { HelperWorkerParameters } from "@redux-saga/core/effects";
import { ActionPattern, Task } from "@redux-saga/types";

type Saga = (...args: any[]) => any;

export const takeLatestWithCancel = <A extends Action, C extends Action>(
  pattern: ActionPattern<A>,
  cancelPattern: ActionPattern<C>,
  saga: Saga,
  ...args: HelperWorkerParameters<A, Saga>
) =>
  fork(function* () {
    let task: Task | null = null;

    while (true) {
      const { action, cancel } = yield race({
        action: take(pattern),
        cancel: take(cancelPattern),
      });

      if (action) {
        if (task?.isRunning()) {
          task.cancel();
        }

        task = yield fork(saga, ...args.concat(action));
      } else if (cancel) {
        task?.cancel();
        task = null;
      }
    }
  });
