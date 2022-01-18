import Api from "../../services/Api";
import { ApiEndpoint } from "../../shared/constants";
import { Collection, InvoicesSubmission, Proposal } from "../../shared/models";
import { transformFirebaseDataSingle } from "../../shared/utils";
import firebase from "../../shared/utils/firebase";

export async function fetchProposal(proposalId: string): Promise<Proposal> {
  const proposal = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .doc(proposalId)
    .get();
  const data = transformFirebaseDataSingle<Proposal>(proposal);
  return data;
}

export async function uploadInvoices(invoicesData: InvoicesSubmission): Promise<void> {
  await Api.post(
    ApiEndpoint.UploadInvoices,
    invoicesData
  )
}
