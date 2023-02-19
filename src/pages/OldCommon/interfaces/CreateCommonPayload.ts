import { UploadFile } from "@/shared/interfaces";
import { BaseRule, CommonLink } from "@/shared/models";
import { MemberAdmittanceLimitations } from "@/shared/models/governance/proposals";
import { TextEditorValue } from "@/shared/ui-kit/TextEditor/types";

export interface CreateCommonPayload {
  name: string;
  image: string;
  byline?: string;
  description?: string;
  unstructuredRules?: BaseRule[];
  links?: CommonLink[];
  searchable?: boolean;
  useTemplate: boolean;
}

export interface CreateSubCommonPayload
  extends Omit<CreateCommonPayload, "searchable" | "useTemplate"> {
  commonId: string;
  circleId: string;
}

export interface IntermediateCreateCommonPayload
  extends Omit<
    CreateCommonPayload,
    "image" | "searchable" | "useTemplate" | "unstructuredRules"
  > {
  image: string | File | null;
  agreementAccepted: boolean;
  rules?: CreateCommonPayload["unstructuredRules"];
  circleIdFromParent?: string;
  memberAdmittanceOptions?: MemberAdmittanceLimitations;
}

export interface IntermediateUpdateCommonData {
  name: string;
  image: UploadFile;
  byline?: string;
  description?: string | TextEditorValue;
  videoUrl?: string;
  gallery?: UploadFile[];
  links?: CommonLink[];
}

export interface UpdateCommonData {
  name: string;
  image: string | File;
  byline?: string;
  description?: string;
  video?: CommonLink;
  gallery?: CommonLink[];
  links?: CommonLink[];
}

export interface UpdateCommonPayload {
  commonId: string;
  changes: UpdateCommonData;
}
