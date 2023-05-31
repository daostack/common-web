import { Timestamp } from "./Timestamp";

export interface SoftDeleteEntity {
  isDeleted: boolean;
  deletedAt?: Timestamp;
}
