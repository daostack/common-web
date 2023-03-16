import { LoadingState } from "@/shared/interfaces";
import { Common, Governance } from "@/shared/models";

export interface Data {
  common: Common;
  governance: Governance;
}

export type State = LoadingState<Data | null>;

export type CombinedState = LoadingState<Data | null>;
