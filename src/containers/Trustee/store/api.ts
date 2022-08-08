import Api from "../../../services/Api";
import { ApiEndpoint, ProposalsTypes } from "@/shared/constants";
import { Collection, Proposal } from "@/shared/models";
import {
  FundsAllocation,
  FundingAllocationStatus,
} from "@/shared/models/governance/proposals";
import {
  transformFirebaseDataList,
  transformFirebaseDataSingle,
  sortByCreatedTime,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import { ApproveOrDeclineProposalDto } from "../interfaces";

export async function fetchPendingApprovalProposals(): Promise<
  FundsAllocation[]
> {
  const proposals = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .where("type", "==", ProposalsTypes.FUNDS_ALLOCATION)
    .where(
      "data.tracker.status",
      "==",
      FundingAllocationStatus.PENDING_INVOICE_APPROVAL
    )
    .get();
  const data =
    transformFirebaseDataList<FundsAllocation>(proposals).sort(
      sortByCreatedTime
    );

  return data;
}

export async function fetchApprovedProposals(): Promise<FundsAllocation[]> {
  const proposals = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .where("type", "==", ProposalsTypes.FUNDS_ALLOCATION)
    .where("data.tracker.trusteeApprovedAt", "!=", null)
    .get();
  const data =
    transformFirebaseDataList<FundsAllocation>(proposals).sort(
      sortByCreatedTime
    );

  return data;
}

export async function fetchDeclinedProposals(): Promise<FundsAllocation[]> {
  const proposals = await firebase
    .firestore()
    .collection(Collection.Proposals)
    .where("type", "==", ProposalsTypes.FUNDS_ALLOCATION)
    .where("data.legal.payoutDocsRejectionReason", "!=", null)
    .where(
      "data.tracker.status",
      "==",
      FundingAllocationStatus.PENDING_INVOICE_UPLOAD
    )
    .get();
  const data =
    transformFirebaseDataList<FundsAllocation>(proposals).sort(
      sortByCreatedTime
    );

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
