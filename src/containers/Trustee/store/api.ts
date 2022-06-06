import Api from "../../../services/Api";
import { ApiEndpoint } from "@/shared/constants";
import {
  Collection,
  FundingProcessStage,
  Proposal,
  ProposalType,
  ProposalState,
} from "@/shared/models";
import {
  transformFirebaseDataList,
  transformFirebaseDataSingle,
  sortByCreatedTime,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import { ApproveOrDeclineProposalDto } from "../interfaces";

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
  const data = transformFirebaseDataList<Proposal>(proposals).sort(sortByCreatedTime);

  return data;
}

export async function fetchApprovedProposals(): Promise<Proposal[]> {
  const results = await Promise.all([
    await firebase
      .firestore()
      .collection(Collection.Proposals)
      .where("type", "==", ProposalType.FundingRequest)
      .where("state", "==", ProposalState.PASSED)
      .get(),
    await firebase
      .firestore()
      .collection(Collection.Proposals)
      .where(
        "fundingProcessStage",
        "==",
        FundingProcessStage.FundsTransferInProgress
      )
      .get(),
  ]);
  const filteredProposals = transformFirebaseDataList<Proposal>(
    results[0]
  ).filter(
    (proposal) =>
      !proposal.fundingProcessStage ||
      proposal.fundingProcessStage === FundingProcessStage.Completed
  );

  const data = [
    ...filteredProposals,
    ...transformFirebaseDataList<Proposal>(results[1]),
  ].sort(sortByCreatedTime);

  return data;
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
  ).sort(sortByCreatedTime);

  return data;
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
