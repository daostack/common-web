import { BaseRule, CommonLink } from "@/shared/models";

export interface CreateCommonPayload {
  name: string;
  image: string;
  byline?: string;
  description?: string;
  rules?: BaseRule[];
  links?: CommonLink[];
  searchable?: boolean;
  useTemplate: boolean;
}

export interface IntermediateCreateCommonPayload
  extends Omit<CreateCommonPayload, "image" | "searchable"> {
  image: string | File | null;
  agreementAccepted: boolean;
}
