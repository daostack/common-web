import { Circle } from "./Circles";

export interface Role extends Pick<Circle, "derivedFrom"> {
  circleId: string;
  circleName: string;
  tier?: number;
}

export type Roles = Role[];
