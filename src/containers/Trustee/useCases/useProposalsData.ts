import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingState } from "@/shared/interfaces";
import { Common, Proposal } from "@/shared/models";
import { getProposalsData } from "../store/actions";
import { ExtendedProposal } from "../interfaces";
import {
  selectPendingApprovalProposals,
  selectApprovedProposals,
  selectDeclinedProposals,
  selectCommons,
} from "../store/selectors";

interface Return {
  extendedPendingApprovalProposals: ExtendedProposal[] | null;
  extendedApprovedProposals: ExtendedProposal[] | null;
  extendedDeclinedProposals: ExtendedProposal[] | null;
}

const getExtendedProposals = (
  { loading, fetched, data: proposals }: LoadingState<Proposal[]>,
  commons: Common[]
): ExtendedProposal[] | null => {
  if (loading || !fetched) {
    return null;
  }

  const extendedProposals: ExtendedProposal[] = [];

  for (const proposal of proposals) {
    const common = commons.find(({ id }) => id === proposal.commonId);

    if (!common) {
      return null;
    }

    extendedProposals.push({
      ...proposal,
      common,
    });
  }

  return extendedProposals;
};

export const useProposalsData = (): Return => {
  const dispatch = useDispatch();
  const pendingApprovalProposals = useSelector(
    selectPendingApprovalProposals()
  );
  const approvedProposals = useSelector(selectApprovedProposals());
  const declinedProposals = useSelector(selectDeclinedProposals());
  const commons = useSelector(selectCommons());
  const extendedPendingApprovalProposals = useMemo<ExtendedProposal[] | null>(
    () => getExtendedProposals(pendingApprovalProposals, commons.data),
    [pendingApprovalProposals, commons.data]
  );
  const extendedApprovedProposals = useMemo<ExtendedProposal[] | null>(
    () => getExtendedProposals(approvedProposals, commons.data),
    [approvedProposals, commons.data]
  );
  const extendedDeclinedProposals = useMemo<ExtendedProposal[] | null>(
    () => getExtendedProposals(declinedProposals, commons.data),
    [declinedProposals, commons.data]
  );

  useEffect(() => {
    const proposals = [
      ...pendingApprovalProposals.data,
      ...approvedProposals.data,
      ...declinedProposals.data,
    ];

    const commonIds = proposals.map((proposal) => proposal.commonId);

    dispatch(
      getProposalsData.request({
        commonIds: Array.from(new Set(commonIds)),
      })
    );
  }, [
    dispatch,
    pendingApprovalProposals.data,
    approvedProposals.data,
    declinedProposals.data,
  ]);

  return {
    extendedPendingApprovalProposals,
    extendedApprovedProposals,
    extendedDeclinedProposals,
  };
};
