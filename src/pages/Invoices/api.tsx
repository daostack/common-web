import Api from "@/services/Api";
import { ApiEndpoint } from "@/shared/constants";
import { Collection, InvoicesSubmission, Proposal } from "@/shared/models";
import {
  FundsAllocation,
  isFundsAllocationProposal,
} from "@/shared/models/governance/proposals";
import { transformFirebaseDataSingle } from "@/shared/utils";
import firebase from "@/shared/utils/firebase";

export async function fetchProposal(
  proposalId: string,
): Promise<FundsAllocation | null> {
  const proposal = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .doc(proposalId)
    .get();
  const data = transformFirebaseDataSingle<Proposal>(proposal);

  return isFundsAllocationProposal(data) ? data : null;
}

export async function uploadInvoices(
  invoicesData: InvoicesSubmission,
): Promise<void> {
  await Api.post(ApiEndpoint.UploadInvoices, invoicesData);
}
