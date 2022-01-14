import React, { useCallback, useEffect, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  Loader,
  Separator,
} from "../../../../shared/components";
import { Proposal } from "../../../../shared/models";
import { ProposalList } from "../../components/ProposalList";
import { StickyInfo } from "../../components/StickyInfo";
import {
  getPendingApprovalProposals,
  getApprovedProposals,
  getDeclinedProposals,
} from "../../store/actions";
import {
  selectProposalForApproval,
  selectIsProposalForApprovalLoaded,
} from "../../store/selectors";
import "./index.scss";

const InvoiceAcceptanceContainer: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const proposalForApproval = useSelector(selectProposalForApproval());
  const isProposalForApprovalLoaded = useSelector(
    selectIsProposalForApprovalLoaded()
  );

  return (
    <>
      <StickyInfo className="invoice-acceptance-container__sticky-info">
        <Separator className="invoice-acceptance-container__separator" />
      </StickyInfo>
      <div className="invoice-acceptance-container">
        {!isProposalForApprovalLoaded && <Loader />}
        {proposalForApproval && isProposalForApprovalLoaded && (
          <>
            InvoiceAcceptanceContainer
          </>
        )}
      </div>
    </>
  );
};

export default InvoiceAcceptanceContainer;
