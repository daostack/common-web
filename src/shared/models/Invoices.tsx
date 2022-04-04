import { DocInfo } from "./Proposals";

export interface InvoicesSubmission {
  proposalID: string;
  payoutDocs: DocInfo[];
  payoutDocsComment?: string;
}
