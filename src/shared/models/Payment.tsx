export enum PaymentStatus {
  TokenCreated = "tokenCreated",
  Failed = "failed",
}

export interface Payment {
  commonId?: string;
  proposalId: string;
  status: PaymentStatus;
}
