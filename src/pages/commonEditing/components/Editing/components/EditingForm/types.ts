import { ProjectCreationFormValues } from "@/pages/commonCreation/components/ProjectCreation/components/ProjectCreationForm";

export type EditingFormValues = Omit<
  ProjectCreationFormValues,
  "highestCircleId"
>;
