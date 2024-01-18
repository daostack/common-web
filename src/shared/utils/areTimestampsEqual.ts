import { Timestamp } from "../models";

export const areTimestampsEqual = (
  timestampA: Timestamp | null,
  timestampB: Timestamp | null,
): boolean =>
  timestampA?.seconds === timestampB?.seconds &&
  timestampA?.nanoseconds === timestampB?.nanoseconds;
