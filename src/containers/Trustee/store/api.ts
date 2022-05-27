import Api from "../../../services/Api";
import { ApiEndpoint, ProposalsTypes } from "@/shared/constants";
import { Collection, Proposal, ProposalState } from "@/shared/models";
import {
  FundsAllocation,
  FundingAllocationStatus,
} from "@/shared/models/governance/proposals";
import {
  transformFirebaseDataList,
  transformFirebaseDataSingle,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import { ApproveOrDeclineProposalDto } from "../interfaces";

function sortByCreateTime<
  T extends { createdAt: firebase.firestore.Timestamp }[]
>(data: T): T {
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
  const data = transformFirebaseDataList<FundsAllocation>(proposals);

  return sortByCreateTime(data);
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
  ];

  return sortByCreateTime(data);
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
  const data = transformFirebaseDataList<FundsAllocation>(proposals);

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
