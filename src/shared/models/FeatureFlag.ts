import { FeatureFlags } from "../constants";

export type UserFeatureFlags = Partial<Record<FeatureFlags, boolean>>;

export interface FeatureFlag {
  enabled: boolean;
}
