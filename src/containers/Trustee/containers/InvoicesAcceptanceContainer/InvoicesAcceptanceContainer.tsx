import React, { useCallback, useEffect, useState, FC } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Separator, Tabs, Tab, TabPanel } from "../../../../shared/components";
import { useQueryParams } from "../../../../shared/hooks";
import { Proposal } from "../../../../shared/models";
import { ProposalList } from "../../components/ProposalList";
import { StickyInfo } from "../../components/StickyInfo";
import {
  getPendingApprovalProposals,
  getApprovedProposals,
  getDeclinedProposals,
} from "../../store/actions";
import "./index.scss";

enum TabState {
  InProgress = "in-progress",
  Approved = "approved",
}

interface ProposalsFetch {
  data: Proposal[];
  fetched: boolean;
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
  const [
    pendingApprovalProposals,
    setPendingApprovalProposals,
  ] = useState<ProposalsFetch>({ data: [], fetched: false });
  const [
    approvedProposals,
    setApprovedProposals,
  ] = useState<ProposalsFetch>({ data: [], fetched: false });
  const [
    declinedProposals,
    setDeclinedProposals,
  ] = useState<ProposalsFetch>({ data: [], fetched: false });

  const handleTabChange = useCallback(
    (value: unknown) => {
      history.replace({ search: `?${TAB_QUERY_PARAM}=${value}` });
      setTab(value as TabState);
    },
    [history]
  );

  const handleProposalView = useCallback((proposal: Proposal) => {
    console.log(proposal);
  }, []);

  useEffect(() => {
    dispatch(
      getPendingApprovalProposals.request({
        callback: (error, proposals) => {
          if (!error) {
            setPendingApprovalProposals({
              data: proposals || [],
              fetched: true,
            });
          }
        },
      })
    );
    dispatch(
      getApprovedProposals.request({
        callback: (error, proposals) => {
          if (!error) {
            setApprovedProposals({
              data: proposals || [],
              fetched: true,
            });
          }
        },
      })
    );
    dispatch(
      getDeclinedProposals.request({
        callback: (error, proposals) => {
          if (!error) {
            setDeclinedProposals({
              data: proposals || [],
              fetched: true,
            });
          }
        },
      })
    );
  }, [dispatch]);

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
            title="Pending approval (3)"
            emptyListText="There are no pending approval invoices"
            proposals={pendingApprovalProposals.data}
            onProposalView={handleProposalView}
          />
          <ProposalList
            title="Declined (2)"
            emptyListText="There are no declined invoices"
            proposals={declinedProposals.data}
            onProposalView={handleProposalView}
          />
        </TabPanel>
        <TabPanel value={tab} panelValue={TabState.Approved}>
          <ProposalList
            title="Approved Invoices"
            emptyListText="There are no approved invoices"
            proposals={approvedProposals.data}
            onProposalView={handleProposalView}
          />
        </TabPanel>
      </div>
    </>
  );
};

export default InvoicesAcceptanceContainer;
