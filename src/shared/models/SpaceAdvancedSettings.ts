export interface InheritFromCircle {
  governanceId: string;
  circleId: string;
  circleName: string;
  tier?: number;
}

export interface InheritedCircleIntermediate {
  circleId: string;
  circleName: string;
  selected: boolean;
  synced: boolean;
  inheritFrom?: InheritFromCircle;
}

export interface SpaceAdvancedSettingsIntermediate {
  permissionGovernanceId?: string;
  circles?: InheritedCircleIntermediate[];
}
