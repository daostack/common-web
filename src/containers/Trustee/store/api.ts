import Api from "../../../services/Api";
import { ApiEndpoint } from "../../../shared/constants";
import {
  Collection,
  FundingProcessStage,
  Proposal,
  ProposalType,
  ProposalState,
} from "../../../shared/models";
import { transformFirebaseDataList, transformFirebaseDataSingle } from "../../../shared/utils";
import firebase from "../../../shared/utils/firebase";
import { ApproveOrDeclineProposalDto } from "../interfaces";

function sortByCreateTime(data: Proposal[]) {
  return data.sort((itemA, itemB) => {
    if (!itemB.createdAt) {
      return -1;
    }
    if (!itemA.createdAt) {
      return 1;
    }

    return itemB.createdAt.seconds - itemA.createdAt.seconds;
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

export async function fetchProposalById(
  proposalId: string
): Promise<Proposal | null> {
  const proposal = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .doc(proposalId)
    .get();

  return proposal && transformFirebaseDataSingle<Proposal>(proposal);
}

export async function approveOrDeclineProposal(
  data: ApproveOrDeclineProposalDto
): Promise<void> {
  await Api.post(ApiEndpoint.ApproveOrDeclineProposal, data);
}
