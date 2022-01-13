import React, { useCallback, useState, FC } from "react";
import { useHistory } from "react-router";
import { Separator, Tabs, Tab, TabPanel } from "../../../../shared/components";
import { useQueryParams } from "../../../../shared/hooks";
import { StickyInfo } from "../../components/StickyInfo";
import "./index.scss";

enum TabState {
  InProgress = "in-progress",
  Approved = "approved",
}

const TAB_QUERY_PARAM = "tab";

const InvoicesAcceptanceContainer: FC = () => {
  const history = useHistory();
  const queryParams = useQueryParams();
  const [tab, setTab] = useState<TabState>(() =>
    queryParams[TAB_QUERY_PARAM] === TabState.Approved
      ? TabState.Approved
      : TabState.InProgress
  );

  const handleTabChange = useCallback(
    (value: unknown) => {
      history.replace({ search: `?${TAB_QUERY_PARAM}=${value}` });
      setTab(value as TabState);
    },
    [history]
  );

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
          In progress
        </TabPanel>
        <TabPanel value={tab} panelValue={TabState.Approved}>
          Approved
        </TabPanel>
      </div>
    </>
  );
};

export default InvoicesAcceptanceContainer;
