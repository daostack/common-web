import { Proposal } from "../../shared/models";
import { transformFirebaseDataList } from "../../shared/utils";
import firebase from "../../shared/utils/firebase";

export async function fetchProposal(proposalId: string) {
  const proposal = await firebase
    .firestore()
    .collection("proposals")
    .where("id", "==", proposalId)
    .get();
  const data = transformFirebaseDataList<Proposal>(proposal);
  return data[0];
}
