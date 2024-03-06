import { FeatureFlags, FeatureFlagVisibility } from "../constants";

export type FeatureFlagOptions = {
  enabled: boolean;
  visibility: FeatureFlagVisibility;
  users: string[];
  feature: FeatureFlags;
}

export interface FeatureFlag {
  features: FeatureFlagOptions[];
  // AdvancedSettings: FeatureFlagOptions;
  teamIds: string[];
}
