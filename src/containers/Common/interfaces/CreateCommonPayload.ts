import { BaseRule, CommonLink } from "@/shared/models";

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
}
