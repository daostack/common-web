import { BaseEntity } from "@/shared/interfaces/BaseEntity";
import { Circles } from "@/shared/interfaces/governance/Circles";
import { Consequences } from "@/shared/interfaces/governance/Consequences";
import { GovernanceActions } from "@/shared/interfaces/governance/GovernanceActions";
import { Proposals } from "@/shared/interfaces/Proposals";
import { UnstructuredRules } from "./UnstructuredRules";

export interface Governance extends BaseEntity {
  actions: Partial<{ [key in GovernanceActions]: { cost: number } }>,
  proposals: Partial<Proposals>,
  circles: Circles,
  tokenPool: number,
  unstructuredRules: UnstructuredRules,
  consequences: Partial<Consequences>,
  readonly commonId: string
}
