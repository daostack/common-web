import { GovernanceActions } from "@/shared/constants";
import { BaseEntity } from "../BaseEntity";
import { Circles } from "./Circles";
import { Proposals } from "./proposals";
import { UnstructuredRules } from "./UnstructuredRules";

export interface Governance extends BaseEntity {
  actions: Partial<{ [key in GovernanceActions]: boolean }>;
  proposals: Partial<Proposals>;
  circles: Circles;
  unstructuredRules: UnstructuredRules;
  readonly commonId: string;
}
