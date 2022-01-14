import React, { useCallback, useEffect, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Separator, Tabs, Tab, TabPanel } from "../../../../shared/components";
import { ROUTE_PATHS } from "../../../../shared/constants";
import { useQueryParams } from "../../../../shared/hooks";
import { Proposal } from "../../../../shared/models";
import { ProposalList } from "../../components/ProposalList";
import { StickyInfo } from "../../components/StickyInfo";
import {
  getPendingApprovalProposals,
  getApprovedProposals,
  getDeclinedProposals,
  getProposalForApproval,
} from "../../store/actions";
import {
  selectPendingApprovalProposals,
  selectArePendingApprovalProposalsLoaded,
  selectApprovedProposals,
  selectAreApprovedProposalLoaded,
  selectDeclinedProposals,
  selectAreDeclinedProposalsLoaded,
} from "../../store/selectors";
import "./index.scss";

enum TabState {
  InProgress = "in-progress",
  Approved = "approved",
}

const TAB_QUERY_PARAM = "tab";

const InvoicesAcceptanceContainer: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const queryParams = useQueryParams();
  const [tab, setTab] = useState<TabState>(() =>
    queryParams[TAB_QUERY_PARAM] === TabState.Approved
      ? TabState.Approved
      : TabState.InProgress
  );
  const pendingApprovalProposals = useSelector(
    selectPendingApprovalProposals()
  );
  const arePendingApprovalProposalsLoaded = useSelector(
    selectArePendingApprovalProposalsLoaded()
  );
  const approvedProposals = useSelector(selectApprovedProposals());
  const areApprovedProposalLoaded = useSelector(
    selectAreApprovedProposalLoaded()
  );
  const declinedProposals = useSelector(selectDeclinedProposals());
  const areDeclinedProposalsLoaded = useSelector(
    selectAreDeclinedProposalsLoaded()
  );

  const handleTabChange = useCallback(
    (value: unknown) => {
      history.replace({ search: `?${TAB_QUERY_PARAM}=${value}` });
      setTab(value as TabState);
    },
    [history]
  );

  const handleProposalView = useCallback((proposal: Proposal) => {
    dispatch(getProposalForApproval.success(proposal));
    history.push(ROUTE_PATHS.TRUSTEE_INVOICE.replace(":proposalId", proposal.id));
  }, [dispatch, history]);

  useEffect(() => {
    if (!arePendingApprovalProposalsLoaded) {
      dispatch(getPendingApprovalProposals.request());
    }
  }, [dispatch, arePendingApprovalProposalsLoaded]);

  useEffect(() => {
    if (!areApprovedProposalLoaded) {
      dispatch(getApprovedProposals.request());
    }
  }, [dispatch, areApprovedProposalLoaded]);

  useEffect(() => {
    if (!areDeclinedProposalsLoaded) {
      dispatch(getDeclinedProposals.request());
    }
  }, [dispatch, areDeclinedProposalsLoaded]);

  return (
    <>
      <StickyInfo className="invoices-acceptance-container__sticky-info">
        <Separator className="invoices-acceptance-container__separator" />
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="In progress" value={TabState.InProgress} />
          <Tab label="Approved" value={TabState.Approved} />
        </Tabs>
      </StickyInfo>
      <div className="invoices-acceptance-container">
        <TabPanel value={tab} panelValue={TabState.InProgress}>
          <ProposalList
            title={`Pending approval (${pendingApprovalProposals.length})`}
            emptyListText="There are no pending approval invoices"
            proposals={pendingApprovalProposals}
            isLoading={!arePendingApprovalProposalsLoaded}
            onProposalView={handleProposalView}
          />
          <ProposalList
            title={`Declined (${declinedProposals.length})`}
            emptyListText="There are no declined invoices"
            proposals={declinedProposals}
            isLoading={!areDeclinedProposalsLoaded}
            onProposalView={handleProposalView}
          />
        </TabPanel>
        <TabPanel value={tab} panelValue={TabState.Approved}>
          <ProposalList
            title="Approved Invoices"
            emptyListText="There are no approved invoices"
            proposals={approvedProposals}
            isLoading={!areApprovedProposalLoaded}
            onProposalView={handleProposalView}
          />
        </TabPanel>
      </div>
    </>
  );
};

export default InvoicesAcceptanceContainer;
