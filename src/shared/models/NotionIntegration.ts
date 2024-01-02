import { BaseEntity } from "./BaseEntity";
import { Timestamp } from "./Timestamp";

export interface NotionIntegrationPayload {
  databaseId: string;
  token: string;
}

export interface NotionIntegrationPayloadIntermediate
  extends NotionIntegrationPayload {
  isEnabled: boolean;
}

export enum SyncLeaseStatus {
  Success = "success",
  Pending = "pending",
  Error = "error",
}

export interface NotionIntegration extends BaseEntity {
  databaseId: string;
  lastSuccessfulSyncAt: Timestamp | null;
  syncLease?: {
    expiresAt: Timestamp;
    attempts: number;
    status: SyncLeaseStatus;
  };
}
