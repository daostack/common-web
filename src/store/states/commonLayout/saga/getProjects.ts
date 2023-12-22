import { call, put, select } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import { Awaited } from "@/shared/interfaces";
import { User } from "@/shared/models";
import { isError } from "@/shared/utils";
import * as actions from "../actions";
import { getProjects as getProjectsUtil } from "./utils";

export function* getProjects(
  action: ReturnType<typeof actions.getProjects.request>,
) {
  const { payload: commonId } = action;

  try {
    const user = (yield select(selectUser())) as User | null;
    const userId = user?.uid;
    const projectsData = (yield call(
      getProjectsUtil,
      commonId,
      userId,
    )) as Awaited<ReturnType<typeof getProjectsUtil>>;

    yield put(actions.getProjects.success(projectsData));
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getProjects.failure(error));
    }
  }
}
