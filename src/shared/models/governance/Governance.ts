import { GovernanceActions } from "@/shared/constants";
import { BaseEntity } from "../BaseEntity";
import { Circles } from "./Circles";
import { UnstructuredRules } from "./UnstructuredRules";
import { Proposals } from "./proposals";

export interface Governance extends BaseEntity {
  actions: Partial<{ [key in GovernanceActions]: boolean }>;
  proposals: Partial<Proposals>;
  circles: Circles;
  unstructuredRules: UnstructuredRules;
  discussions: {
    defaultVisibility: string;
  };
  readonly commonId: string;
}
