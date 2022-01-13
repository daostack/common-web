import {
  Collection,
  FundingProcessStage,
  Proposal,
  ProposalType,
  ProposalState,
} from "../../../shared/models";
import { transformFirebaseDataList } from "../../../shared/utils";
import firebase from "../../../shared/utils/firebase";

function sortByCreateTime(data: Proposal[]) {
  return data.sort((itemA, itemB) => {
    if (!itemB.createTime) {
      return -1;
    }
    if (!itemA.createTime) {
      return 1;
    }

    return itemB.createTime.seconds - itemA.createTime.seconds;
  });
}

export async function fetchPendingApprovalProposals(): Promise<Proposal[]> {
  const proposals = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .where(
      "fundingProcessStage",
      "==",
      FundingProcessStage.PendingInvoiceApproval
    )
    .get();
  const data = transformFirebaseDataList<Proposal>(proposals);

  return sortByCreateTime(data);
}

export async function fetchApprovedProposals(): Promise<Proposal[]> {
  const proposals = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .where("type", "==", ProposalType.FundingRequest)
    .where("state", "==", ProposalState.PASSED)
    .get();
  const data = transformFirebaseDataList<Proposal>(proposals);

  return sortByCreateTime(data);
}

export async function fetchDeclinedProposals(): Promise<Proposal[]> {
  const proposals = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .where("payoutDocsRejectionReason", "!=", "")
    .get();
  const data = transformFirebaseDataList<Proposal>(proposals).filter(
    (proposal) =>
      proposal.fundingProcessStage === FundingProcessStage.PendingInvoiceUpload
  );

  return sortByCreateTime(data);
}
