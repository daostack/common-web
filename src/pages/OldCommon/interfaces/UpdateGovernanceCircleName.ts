interface NewCircle {
  circleId: string;
  newName: string;
}

export interface UpdateGovernanceCircleNamePayload {
  commonId: string;
  userId: string;
  changes: NewCircle[];
}
