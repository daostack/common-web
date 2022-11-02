import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingState } from "@/shared/interfaces";
import { Common, User } from "@/shared/models";
import { FundsAllocation } from "@/shared/models/governance/proposals";
import { ExtendedProposal } from "../interfaces";
import { getProposalsData } from "../store/actions";
import {
  selectPendingApprovalProposals,
  selectApprovedProposals,
  selectDeclinedProposals,
  selectCommons,
  selectUsers,
} from "../store/selectors";

interface Return {
  extendedPendingApprovalProposals: ExtendedProposal[] | null;
  extendedApprovedProposals: ExtendedProposal[] | null;
  extendedDeclinedProposals: ExtendedProposal[] | null;
}

const getExtendedProposals = (
  { loading, fetched, data: proposals }: LoadingState<FundsAllocation[]>,
  commons: Common[] | null,
  users: User[] | null,
): ExtendedProposal[] | null => {
  if (loading || !fetched || !commons || !users) {
    return null;
  }

  const extendedProposals: ExtendedProposal[] = [];

  for (const proposal of proposals) {
    const common = commons.find(({ id }) => id === proposal.data.args.commonId);
    const user = users.find(({ uid }) => uid === proposal.data.args.proposerId);

    extendedProposals.push({
      proposal,
      common,
      user,
    });
  }

  return extendedProposals;
};

export const useProposalsData = (): Return => {
  const dispatch = useDispatch();
  const pendingApprovalProposals = useSelector(
    selectPendingApprovalProposals(),
  );
  const approvedProposals = useSelector(selectApprovedProposals());
  const declinedProposals = useSelector(selectDeclinedProposals());
  const commons = useSelector(selectCommons());
  const users = useSelector(selectUsers());
  const extendedPendingApprovalProposals = useMemo<ExtendedProposal[] | null>(
    () =>
      getExtendedProposals(pendingApprovalProposals, commons.data, users.data),
    [pendingApprovalProposals, commons.data, users.data],
  );
  const extendedApprovedProposals = useMemo<ExtendedProposal[] | null>(
    () => getExtendedProposals(approvedProposals, commons.data, users.data),
    [approvedProposals, commons.data, users.data],
  );
  const extendedDeclinedProposals = useMemo<ExtendedProposal[] | null>(
    () => getExtendedProposals(declinedProposals, commons.data, users.data),
    [declinedProposals, commons.data, users.data],
  );

  useEffect(() => {
    if (
      !pendingApprovalProposals.fetched ||
      !approvedProposals.fetched ||
      !declinedProposals.fetched
    ) {
      return;
    }

    const proposals = [
      ...pendingApprovalProposals.data,
      ...approvedProposals.data,
      ...declinedProposals.data,
    ];

    const commonIds = proposals.map((proposal) => proposal.data.args.commonId);
    const userIds = proposals.map((proposal) => proposal.data.args.proposerId);

    dispatch(
      getProposalsData.request({
        commonIds: Array.from(new Set(commonIds)),
        userIds: Array.from(new Set(userIds)),
      }),
    );
  }, [
    dispatch,
    pendingApprovalProposals.fetched,
    pendingApprovalProposals.data,
    approvedProposals.fetched,
    approvedProposals.data,
    declinedProposals.fetched,
    declinedProposals.data,
  ]);

  return {
    extendedPendingApprovalProposals,
    extendedApprovedProposals,
    extendedDeclinedProposals,
  };
};
