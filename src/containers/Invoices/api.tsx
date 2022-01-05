import Api from "../../services/Api";
import { ApiEndpoint } from "../../shared/constants";
import { InvoicesSubmission, Proposal } from "../../shared/models";
import { transformFirebaseDataList } from "../../shared/utils";
import firebase from "../../shared/utils/firebase";

export async function fetchProposal(proposalId: string): Promise<Proposal> {
  const proposal = await firebase
    .firestore()
    .collection("proposals")
    .where("id", "==", proposalId)
    .get();
  const data = transformFirebaseDataList<Proposal>(proposal);
  return data[0];
}

export async function uploadInvoices(invoicesData: InvoicesSubmission) {
  const { data } = await Api.post(
    ApiEndpoint.UploadInvoices,
    invoicesData
  )
  return data;
}
