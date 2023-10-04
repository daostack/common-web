import { BaseRule, CommonLink, Roles } from "@/shared/models";
import { TextEditorValue } from "@/shared/ui-kit";
import { UploadFile } from "./UploadFile";

export interface CreateProjectPayload {
  name: string;
  byline?: string;
  description?: string;
  image: string;
  links?: CommonLink[];
  unstructuredRules?: BaseRule[];
  gallery?: CommonLink[];
  video?: CommonLink;
  tags?: string[];
  highestCircleId: string;
}

export interface IntermediateCreateProjectPayload {
  projectImages: UploadFile[];
  spaceName: string;
  byline: string;
  description: TextEditorValue;
  videoUrl: string;
  gallery: UploadFile[];
  links?: CommonLink[];
  roles?: Roles;
  highestCircleId: string;
}
