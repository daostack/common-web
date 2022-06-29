import { DocInfo } from "./Proposals";

export interface InvoicesSubmission {
  proposalId: string;
  payoutDocs: DocInfo[];
  payoutDocsComment?: string;
}
