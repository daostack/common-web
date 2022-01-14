import React, { useEffect, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Loader, Separator } from "../../../../shared/components";
import { ROUTE_PATHS } from "../../../../shared/constants";
import LeftArrowIcon from "../../../../shared/icons/leftArrow.icon";
import { ProposalState } from "../../../../shared/models";
import { InvoiceTileList } from "../../components/InvoiceTileList";
import { ProposalCard } from "../../components/ProposalCard";
import { StickyInfo } from "../../components/StickyInfo";
import { getProposalForApproval } from "../../store/actions";
import {
  selectProposalForApproval,
  selectIsProposalForApprovalLoaded,
} from "../../store/selectors";
import {
  InvoicesPageTabState,
  INVOICES_PAGE_TAB_QUERY_PARAM,
} from "../constants";
import "./index.scss";

const InvoiceAcceptanceContainer: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { proposalId } = useParams<{ proposalId: string }>();
  const proposalForApproval = useSelector(selectProposalForApproval());
  const isProposalForApprovalLoaded = useSelector(
    selectIsProposalForApprovalLoaded()
  );
  const backLink = `${ROUTE_PATHS.TRUSTEE_INVOICES}${
    proposalForApproval?.state === ProposalState.PASSED
      ? `?${INVOICES_PAGE_TAB_QUERY_PARAM}=${InvoicesPageTabState.Approved}`
      : ""
  }`;

  useEffect(() => {
    if (!isProposalForApprovalLoaded) {
      dispatch(getProposalForApproval.request(proposalId));
    }
  }, [dispatch, isProposalForApprovalLoaded, proposalId]);

  return (
    <>
      <StickyInfo className="invoice-acceptance-container__sticky-info">
        <Separator />
        <div className="invoice-acceptance-container__back-link-wrapper">
          <Link
            className="invoice-acceptance-container__back-link"
            to={backLink}
          >
            <LeftArrowIcon className="invoice-acceptance-container__left-arrow-icon" />
            back to all requests
          </Link>
        </div>
      </StickyInfo>
      <div className="invoice-acceptance-container">
        {!isProposalForApprovalLoaded && (
          <div className="invoice-acceptance-container__loader-wrapper">
            <Loader />
          </div>
        )}
        {!proposalForApproval && isProposalForApprovalLoaded && (
          <span>Something wrong with the invoice</span>
        )}
        {proposalForApproval && isProposalForApprovalLoaded && (
          <>
            {proposalForApproval.title && (
              <h2 className="invoice-acceptance-container__title">
                {proposalForApproval.title}
              </h2>
            )}
            <ProposalCard proposal={proposalForApproval} />
            <InvoiceTileList
              className="invoice-acceptance-container__invoice-tile-list"
              payoutDocs={proposalForApproval.payoutDocs || []}
            />
          </>
        )}
      </div>
    </>
  );
};

export default InvoiceAcceptanceContainer;
