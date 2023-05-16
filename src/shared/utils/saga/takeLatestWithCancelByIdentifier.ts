import { Action } from "redux";
import { fork, race, take, cancel as cancelTask } from "redux-saga/effects";
import { HelperWorkerParameters } from "@redux-saga/core/effects";
import { ActionPattern, Task } from "@redux-saga/types";

type Saga = (...args: any[]) => any;

export const takeLatestWithCancelByIdentifier = <
  A extends Action,
  C extends Action,
>(
  pattern: ActionPattern<A>,
  identifier: (action: A) => string,
  cancelPattern: ActionPattern<C>,
  saga: Saga,
  ...args: HelperWorkerParameters<A, Saga>
) =>
  fork(function* () {
    const tasks: Record<string, Task> = {};

    while (true) {
      const { action, cancel } = yield race({
        action: take(pattern),
        cancel: take(cancelPattern),
      });
      const id = identifier(action || cancel);
      let task = tasks[id];

      if (action) {
        if (task?.isRunning()) {
          yield cancelTask(task);
        }

        task = yield fork(saga, ...args.concat(action));
        tasks[id] = task;
      } else if (cancel) {
        task?.cancel();

        delete tasks[id];
      }
    }
  });
