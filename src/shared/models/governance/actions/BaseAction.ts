import { GovernanceActions } from "@/shared/constants";

export interface BaseAction {
  cost: number;
  type: GovernanceActions;
}
