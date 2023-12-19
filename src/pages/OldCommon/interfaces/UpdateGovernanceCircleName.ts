import { Timestamp } from "@/shared/models";

interface NewCircle {
  circleId: string;
  newName: string;
}

export interface UpdateGovernanceCirclesNamesPayload {
  commonId: string;
  userId: string;
  changes: NewCircle[];
}

export interface UpdateGovernanceCirclesNamesResponse {
  circles: NewCircle[];
  message: string;
  updatedAt: Timestamp;
}
