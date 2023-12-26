import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  CommonEvent,
  CommonEventEmitter,
  CommonEventToListener,
} from "@/events";
import { updateCommonState } from "@/pages/OldCommon/store/actions";
import {
  commonLayoutActions,
  multipleSpacesLayoutActions,
  projectsActions,
} from "@/store/states";

const CommonHandler: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handler: CommonEventToListener[CommonEvent.CommonCreated] = (
      common,
    ) => {
      dispatch(
        updateCommonState({
          commonId: common.id,
          state: {
            loading: false,
            fetched: true,
            data: common,
          },
        }),
      );
    };

    CommonEventEmitter.on(CommonEvent.CommonCreated, handler);
    CommonEventEmitter.on(CommonEvent.CommonUpdated, handler);

    return () => {
      CommonEventEmitter.off(CommonEvent.CommonCreated, handler);
      CommonEventEmitter.off(CommonEvent.CommonUpdated, handler);
    };
  }, []);

  useEffect(() => {
    const handler: CommonEventToListener[CommonEvent.CommonDeleted] = (
      commonId,
    ) => {
      /**
       * Remove from cache
       */
      dispatch(
        updateCommonState({
          commonId,
          state: {
            loading: false,
            fetched: false,
            data: null,
          },
        }),
      );

      dispatch(commonLayoutActions.deleteCommon({ commonId }));
      dispatch(multipleSpacesLayoutActions.deleteCommon({ commonId }));
      dispatch(projectsActions.deleteCommon({ commonId }));
    };

    CommonEventEmitter.on(CommonEvent.CommonDeleted, handler);

    return () => {
      CommonEventEmitter.off(CommonEvent.CommonDeleted, handler);
    };
  }, []);

  useEffect(() => {
    const handler: CommonEventToListener[CommonEvent.ProjectCreatedOrUpdated] =
      (projectsStateItem) => {
        dispatch(
          multipleSpacesLayoutActions.addOrUpdateProjectInBreadcrumbs(
            projectsStateItem,
          ),
        );
        dispatch(commonLayoutActions.addOrUpdateProject(projectsStateItem));
        dispatch(projectsActions.addOrUpdateProject(projectsStateItem));
      };

    CommonEventEmitter.on(CommonEvent.ProjectCreatedOrUpdated, handler);

    return () => {
      CommonEventEmitter.off(CommonEvent.ProjectCreatedOrUpdated, handler);
    };
  }, []);

  useEffect(() => {
    const handler: CommonEventToListener[CommonEvent.ProjectUpdated] = (
      projectsStateItem,
    ) => {
      dispatch(
        multipleSpacesLayoutActions.updateProjectInBreadcrumbs(
          projectsStateItem,
        ),
      );
      dispatch(commonLayoutActions.updateCommonOrProject(projectsStateItem));
      dispatch(projectsActions.updateProject(projectsStateItem));
    };

    CommonEventEmitter.on(CommonEvent.ProjectUpdated, handler);

    return () => {
      CommonEventEmitter.off(CommonEvent.ProjectUpdated, handler);
    };
  }, []);

  return null;
};

export default CommonHandler;
