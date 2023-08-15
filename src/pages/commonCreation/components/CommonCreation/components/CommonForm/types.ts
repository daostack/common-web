import { ProjectCreationFormValues } from "../../../ProjectCreation/components/ProjectCreationForm";

export type CommonFormValues = Omit<
  ProjectCreationFormValues,
  "highestCircleId"
>;
