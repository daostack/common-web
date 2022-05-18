import { GovernanceActions } from "@/shared/constants";
import { BaseEntity } from "../BaseEntity";
import { Circles } from "./Circles";
import { Consequences } from "./Consequences";
import { Proposals } from "./proposals";
import { UnstructuredRules } from "./UnstructuredRules";

export interface Governance extends BaseEntity {
  actions: Partial<{ [key in GovernanceActions]: { cost: number } }>;
  proposals: Partial<Proposals>;
  circles: Circles;
  tokenPool: number;
  unstructuredRules: UnstructuredRules;
  consequences: Partial<Consequences>;
  readonly commonId: string;
}
