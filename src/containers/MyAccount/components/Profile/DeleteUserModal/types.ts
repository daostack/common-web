import { ErrorCode } from "@/shared/constants";

export interface DeleteError {
  commonId: string;
  commonName: string;
  errorCodes: ErrorCode[];
}

export type LeaveCommonErrors = Extract<
  ErrorCode,
  | ErrorCode.LastMember
  | ErrorCode.LastInCriticalCircle
  | ErrorCode.UserHasOpenProposals
>;

export type ErrorsByCommonId = Record<string, LeaveCommonErrors[]>;
