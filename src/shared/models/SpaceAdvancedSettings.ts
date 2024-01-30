export interface InheritedCircleIntermediate {
  circleId?: string;
  circleName?: string;
  selected?: boolean;
  synced?: boolean;
  inheritFrom?: {
    governanceId?: string;
    circleId?: string;
    circleName?: string;
  };
}

export interface SpaceAdvancedSettingsIntermediate {
  permissionGovernanceId?: string;
  circles?: InheritedCircleIntermediate[];
}
