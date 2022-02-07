import React, { useCallback, useEffect, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  Button,
  Separator,
  Tabs,
  Tab,
  TabPanel,
} from "../../../../shared/components";
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
  selectArePendingApprovalProposalsLoaded,
  selectApprovedProposals,
  selectAreApprovedProposalsLoaded,
  selectDeclinedProposals,
  selectAreDeclinedProposalsLoaded,
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
  const arePendingApprovalProposalsLoaded = useSelector(
    selectArePendingApprovalProposalsLoaded()
  );
  const approvedProposals = useSelector(selectApprovedProposals());
  const areApprovedProposalsLoaded = useSelector(
    selectAreApprovedProposalsLoaded()
  );
  const declinedProposals = useSelector(selectDeclinedProposals());
  const areDeclinedProposalsLoaded = useSelector(
    selectAreDeclinedProposalsLoaded()
  );

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
    if (!arePendingApprovalProposalsLoaded) {
      dispatch(getPendingApprovalProposals.request());
    }
  }, [dispatch, arePendingApprovalProposalsLoaded]);

  useEffect(() => {
    if (!areApprovedProposalsLoaded) {
      dispatch(getApprovedProposals.request());
    }
  }, [dispatch, areApprovedProposalsLoaded]);

  useEffect(() => {
    if (!areDeclinedProposalsLoaded) {
      dispatch(getDeclinedProposals.request());
    }
  }, [dispatch, areDeclinedProposalsLoaded]);

  return (
    <>
      <StickyInfo className="invoices-acceptance-container__sticky-info">
        <Separator />
        <div className="invoices-acceptance-container__sticky-info-content">
          <Tabs
            className="invoices-acceptance-container__tabs"
            value={tab}
            onChange={handleTabChange}
          >
            <Tab label="In progress" value={InvoicesPageTabState.InProgress} />
            <Tab label="Approved" value={InvoicesPageTabState.Approved} />
          </Tabs>
          <Button>Generate Report</Button>
        </div>
      </StickyInfo>
      <div className="invoices-acceptance-container">
        <TabPanel value={tab} panelValue={InvoicesPageTabState.InProgress}>
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
        <TabPanel value={tab} panelValue={InvoicesPageTabState.Approved}>
          <VirtualizedProposalList
            title="Approved Invoices"
            emptyListText="There are no approved invoices"
            proposals={approvedProposals}
            isLoading={!areApprovedProposalsLoaded}
            onProposalView={handleProposalView}
          />
        </TabPanel>
      </div>
    </>
  );
};

export default InvoicesAcceptanceContainer;
