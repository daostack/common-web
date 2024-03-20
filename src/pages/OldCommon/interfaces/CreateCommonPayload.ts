import { SpaceListVisibility, UploadFile } from "@/shared/interfaces";
import {
  BaseRule,
  CommonLink,
  NotionIntegrationPayloadIntermediate,
  Roles,
  SpaceAdvancedSettingsIntermediate,
} from "@/shared/models";
import { MemberAdmittanceLimitations } from "@/shared/models/governance/proposals";
import { TextEditorValue } from "@/shared/ui-kit/TextEditor/types";

export interface CreateCommonPayload {
  name: string;
  image: string | File;
  useTemplate: boolean;
  byline?: string;
  description?: string;
  unstructuredRules?: BaseRule[];
  links?: CommonLink[];
  searchable?: boolean;
  memberAdmittanceOptions: MemberAdmittanceLimitations;
  video?: CommonLink;
  gallery?: CommonLink[];
}

export interface CreateSubCommonPayload
  extends Omit<
    CreateCommonPayload,
    "searchable" | "useTemplate" | "memberAdmittanceOptions"
  > {
  commonId: string;
  circleId: string;
}

export interface IntermediateCreateCommonPayload
  extends Omit<
    CreateCommonPayload,
    | "image"
    | "searchable"
    | "useTemplate"
    | "unstructuredRules"
    | "memberAdmittanceOptions"
  > {
  image: string | File | null;
  agreementAccepted: boolean;
  rules?: CreateCommonPayload["unstructuredRules"];
  circleIdFromParent?: string;
  memberAdmittanceOptions?: MemberAdmittanceLimitations;
}

export interface IntermediateCreateCommonData
  extends Pick<CreateCommonPayload, "name" | "byline" | "links"> {
  image: UploadFile;
  gallery?: UploadFile[];
  description?: string | TextEditorValue;
  videoUrl?: string;
}

export interface IntermediateUpdateCommonData {
  name: string;
  image: UploadFile;
  byline?: string;
  description?: string | TextEditorValue;
  videoUrl?: string;
  gallery?: UploadFile[];
  links?: CommonLink[];
  roles?: Roles;
  notion?: NotionIntegrationPayloadIntermediate;
  advancedSettings?: SpaceAdvancedSettingsIntermediate;
  listVisibility?: SpaceListVisibility;
}

export interface UpdateCommonData {
  name: string;
  image: string | File;
  byline?: string;
  description?: string;
  video?: CommonLink;
  gallery?: CommonLink[];
  links?: CommonLink[];
  listVisibility?: SpaceListVisibility;
}

export interface UpdateCommonPayload {
  commonId: string;
  changes: UpdateCommonData;
}
