import axios from "axios";
import config from "../../config";
import getFirebaseToken from "../../helpers/getFirebaseToken";
import { InvoicesSubmission, Proposal } from "../../shared/models";
import { transformFirebaseDataList } from "../../shared/utils";
import firebase from "../../shared/utils/firebase";

const axiosClient = axios.create({
  timeout: 1000000,
});

export async function fetchProposal(proposalId: string) {
  const proposal = await firebase
    .firestore()
    .collection("proposals")
    .where("id", "==", proposalId)
    .get();
  const data = transformFirebaseDataList<Proposal>(proposal);
  return data[0];
}

// TODO: need to figure out why we can't access to the ref in the firabase storage
export async function generateDownloadURL(image: any) {

}

export async function uploadInvoices(invoicesData: InvoicesSubmission) {
  const endpoint = `${config.cloudFunctionUrl}/payments/payme/payout/save-legal-docs-info`;
  const { data } = await axiosClient.post(
    endpoint,
    invoicesData, {
      headers: {
        Authorization: await getFirebaseToken(),
      }
    }
  )
  console.log(data);
  return data;
}
