import { DocInfo } from "./Proposals";

export interface InvoicesSubmission {
  proposalID: string;
  payoutDocs: DocInfo[];
  payoutDocsComment?: string;
}

export enum PayMeTypeCodes {
  Invoice = 29
}
