export interface PreviewCirclesUpdateCircles {
  type: "new" | "existing";
  circleId: string;
  inheritFrom?: {
    governanceId: string;
    circleId: string;
  };
}

export interface PreviewCirclesUpdatePayload {
  governanceId: string;
  permissionGovernanceId: string;
  circles: PreviewCirclesUpdateCircles[];
  memberAdmittanceOptions?: {
    autoApprove?: boolean;
  };
}

interface ChangedCircle {
  id: string;
  name: string;
}

export interface PreviewCirclesUpdateResponse {
  changes: {
    commonId: string;
    commonName: string;
    governanceId: string;
    members: {
      id: string;
      userId: string;
      circlesAdded: ChangedCircle[];
      circlesRemoved: ChangedCircle[];
      circleIds: string[];
    }[];
  }[];
}
