import { Common, Project } from "@/shared/models";

export const checkIsProject = (common?: Common | null): common is Project =>
  Boolean(common?.directParent);
