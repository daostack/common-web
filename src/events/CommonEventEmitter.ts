import { EventEmitter } from "eventemitter3";
import { Common } from "@/shared/models";
import { ProjectsStateItem } from "@/store/states";

export enum CommonEvent {
  CommonCreated = "common-created",
  CommonUpdated = "common-updated",
  CommonDeleted = "common-deleted",
  ProjectCreatedOrUpdated = "project-created-or-updated",
  ProjectUpdated = "project-updated",
}

export interface CommonEventToListener {
  [CommonEvent.CommonCreated]: (common: Common) => void;
  [CommonEvent.CommonUpdated]: (common: Common) => void;
  [CommonEvent.CommonDeleted]: (deletedCommonId: string) => void;
  [CommonEvent.ProjectCreatedOrUpdated]: (
    projectsStateItem: ProjectsStateItem,
  ) => void;
  [CommonEvent.ProjectUpdated]: (
    projectsStateItem: { commonId: string } & Partial<
      Omit<ProjectsStateItem, "commonId">
    >,
  ) => void;
}

class CommonEventEmitter extends EventEmitter<CommonEventToListener> {}

export default new CommonEventEmitter();
