import React, { useCallback, useEffect, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Separator, Tabs, Tab, TabPanel } from "../../../../shared/components";
import { ROUTE_PATHS } from "../../../../shared/constants";
import { useQueryParams } from "../../../../shared/hooks";
import { Proposal } from "../../../../shared/models";
import { ProposalList } from "../../components/ProposalList";
import { StickyInfo } from "../../components/StickyInfo";
import { VirtualizedProposalList } from "../../components/VirtualizedProposalList";
import {
  getPendingApprovalProposals,
  getApprovedProposals,
  getDeclinedProposals,
  getProposalForApproval,
} from "../../store/actions";
import {
  selectPendingApprovalProposals,
  selectApprovedProposals,
  selectDeclinedProposals,
} from "../../store/selectors";
import {
  InvoicesPageTabState,
  INVOICES_PAGE_TAB_QUERY_PARAM,
} from "../constants";
import "./index.scss";

const InvoicesAcceptanceContainer: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const queryParams = useQueryParams();
  const [tab, setTab] = useState<InvoicesPageTabState>(() =>
    queryParams[INVOICES_PAGE_TAB_QUERY_PARAM] === InvoicesPageTabState.Approved
      ? InvoicesPageTabState.Approved
      : InvoicesPageTabState.InProgress
  );
  const pendingApprovalProposals = useSelector(
    selectPendingApprovalProposals()
  );
  const approvedProposals = useSelector(selectApprovedProposals());
  const declinedProposals = useSelector(selectDeclinedProposals());

  const handleTabChange = useCallback(
    (value: unknown) => {
      history.replace({ search: `?${INVOICES_PAGE_TAB_QUERY_PARAM}=${value}` });
      setTab(value as InvoicesPageTabState);
    },
    [history]
  );

  const handleProposalView = useCallback(
    (proposal: Proposal) => {
      dispatch(getProposalForApproval.success(proposal));
      history.push(
        ROUTE_PATHS.TRUSTEE_INVOICE.replace(":proposalId", proposal.id)
      );
    },
    [dispatch, history]
  );

  useEffect(() => {
    if (
      !pendingApprovalProposals.loading &&
      !pendingApprovalProposals.fetched
    ) {
      dispatch(getPendingApprovalProposals.request());
    }
  }, [
    dispatch,
    pendingApprovalProposals.loading,
    pendingApprovalProposals.fetched,
  ]);

  useEffect(() => {
    if (!approvedProposals.loading && !approvedProposals.fetched) {
      dispatch(getApprovedProposals.request());
    }
  }, [dispatch, approvedProposals.loading, approvedProposals.fetched]);

  useEffect(() => {
    if (!declinedProposals.loading && !declinedProposals.fetched) {
      dispatch(getDeclinedProposals.request());
    }
  }, [dispatch, declinedProposals.loading, declinedProposals.fetched]);

  return (
    <>
      <StickyInfo className="invoices-acceptance-container__sticky-info">
        <Separator className="invoices-acceptance-container__separator" />
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="In progress" value={InvoicesPageTabState.InProgress} />
          <Tab label="Approved" value={InvoicesPageTabState.Approved} />
        </Tabs>
      </StickyInfo>
      <div className="invoices-acceptance-container">
        <TabPanel value={tab} panelValue={InvoicesPageTabState.InProgress}>
          <ProposalList
            title={`Pending approval (${pendingApprovalProposals.data.length})`}
            emptyListText="There are no pending approval invoices"
            proposals={pendingApprovalProposals.data}
            isLoading={!pendingApprovalProposals.fetched}
            onProposalView={handleProposalView}
          />
          <ProposalList
            title={`Declined (${declinedProposals.data.length})`}
            emptyListText="There are no declined invoices"
            proposals={declinedProposals.data}
            isLoading={!declinedProposals.fetched}
            onProposalView={handleProposalView}
          />
        </TabPanel>
        <TabPanel value={tab} panelValue={InvoicesPageTabState.Approved}>
          <VirtualizedProposalList
            title="Approved Invoices"
            emptyListText="There are no approved invoices"
            proposals={approvedProposals.data}
            isLoading={!approvedProposals.fetched}
            onProposalView={handleProposalView}
          />
        </TabPanel>
      </div>
    </>
  );
};

export default InvoicesAcceptanceContainer;
