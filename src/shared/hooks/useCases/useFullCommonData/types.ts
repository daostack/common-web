import { LoadingState } from "@/shared/interfaces";
import { Common, Governance } from "@/shared/models";

export interface Data {
  common: Common;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
  parentCommon?: Common;
  parentCommonSubCommons: Common[];
}

export type State = LoadingState<Data | null>;
