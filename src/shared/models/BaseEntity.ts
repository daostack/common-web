import { Timestamp } from "./Timestamp";

export interface BaseEntity {
  id: string;

  createdAt: Timestamp;

  updatedAt: Timestamp;
}
