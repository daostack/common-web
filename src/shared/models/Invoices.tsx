import { LegalDocInfo } from "./Proposals";

export interface InvoicesSubmission {
  proposalID: string;
  payoutDocs: LegalDocInfo[];
  payoutDocsComment?: string;
}

export enum PAYME_TYPE_CODES {
  Invoice = 29
}
