import { Action } from "redux";
import { fork, take } from "redux-saga/effects";
import { ActionPattern, Task } from "@redux-saga/types";
import { HelperWorkerParameters } from "@redux-saga/core/effects";

type Saga = (...args: any[]) => any;

export const takeLeadingByIdentifier = <A extends Action>(
  pattern: ActionPattern<A>,
  identifier: (action: A) => string,
  saga: Saga,
  ...args: HelperWorkerParameters<A, Saga>
) =>
  fork(function* () {
    const tasks: Record<string, Task> = {};

    while (true) {
      const action = yield take(pattern);
      const id = identifier(action);
      const task = tasks[id];

      if (!task || !task.isRunning()) {
        tasks[id] = yield fork(saga, ...args.concat(action));
      }
    }
  });
