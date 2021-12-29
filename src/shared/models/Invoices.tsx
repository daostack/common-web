import { LegalDocInfo } from "./Proposals";

export interface InvoicesSubmission {
  proposalID: string;
  legalDocsInfo: LegalDocInfo[];
}

export enum PAYME_TYPE_CODES {
  Invoice = 29
}
