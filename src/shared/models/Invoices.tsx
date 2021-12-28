import { LegalDocInfo } from "./Proposals";

export interface InvoicesSubmission {
  proposalID: string;
  legalDocsInfo: LegalDocInfo[];
}
