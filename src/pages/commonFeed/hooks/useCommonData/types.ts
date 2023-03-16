import { LoadingState } from "@/shared/interfaces";
import { Common, Governance, SupportersData } from "@/shared/models";

export interface Data {
  common: Common;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
  parentCommon?: Common;
  parentCommonSubCommons: Common[];
}

export interface SeparatedData {
  supportersData: SupportersData | null;
}

export type State = LoadingState<Data | null>;

export type SeparatedState = LoadingState<SeparatedData | null>;

export type CombinedState = LoadingState<(Data & SeparatedData) | null>;
