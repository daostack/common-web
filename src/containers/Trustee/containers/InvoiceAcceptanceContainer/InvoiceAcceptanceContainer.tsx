import React, { useEffect, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  FilesCarousel,
  Loader,
  Separator,
} from "../../../../shared/components";
import { ROUTE_PATHS } from "../../../../shared/constants";
import LeftArrowIcon from "../../../../shared/icons/leftArrow.icon";
import { DocInfo, ProposalState } from "../../../../shared/models";
import { ApproveInvoicesPrompt } from "../../components/ApproveInvoicesPrompt";
import { DeclineInvoicesPrompt } from "../../components/DeclineInvoicesPrompt";
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
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);
  const [isApprovePromptOpen, setIsApprovePromptOpen] = useState(false);
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const [isApprovalFinished, setIsApprovalFinished] = useState(false);
  const [isDeclinePromptOpen, setIsDeclinePromptOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { proposalId } = useParams<{ proposalId: string }>();
  const proposalForApproval = useSelector(selectProposalForApproval());
  const isProposalForApprovalLoaded = useSelector(
    selectIsProposalForApprovalLoaded()
  );
  const payoutDocs = proposalForApproval?.payoutDocs || [];
  const backLink = `${ROUTE_PATHS.TRUSTEE_INVOICES}${
    proposalForApproval?.state === ProposalState.PASSED
      ? `?${INVOICES_PAGE_TAB_QUERY_PARAM}=${InvoicesPageTabState.Approved}`
      : ""
  }`;

  const handleInvoiceTileClick = (doc: DocInfo, index: number) => {
    setSelectedDocIndex(index);
  };

  const handleFileCarouselClose = () => {
    setSelectedDocIndex(null);
  };

  const handleApproveClick = () => {
    setIsApprovePromptOpen(true);
  };
  const handleApprove = () => {
    setIsApprovalLoading(true);
    setTimeout(() => {
      setIsApprovalFinished(true);
      setIsApprovalLoading(false);
    }, 2000);
  };
  const handleApprovePromptClose = () => {
    setIsApprovePromptOpen(false);
  };

  const handleDeclineClick = () => {
    setIsDeclinePromptOpen(true);
  };
  const handleDecline = (note: string) => {
    console.log(note);
  };
  const handleDeclinePromptClose = () => {
    setIsDeclinePromptOpen(false);
  };

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
              payoutDocs={payoutDocs}
              onDocClick={handleInvoiceTileClick}
            />
            <div className="invoice-acceptance-container__actions-wrapper">
              <button
                className="button-blue invoice-acceptance-container__approve-button"
                onClick={handleApproveClick}
              >
                Approve All
              </button>
              <button
                className="button-blue invoice-acceptance-container__decline-button"
                onClick={handleDeclineClick}
              >
                Decline
              </button>
            </div>
          </>
        )}
        {selectedDocIndex !== null && (
          <FilesCarousel
            payoutDocs={payoutDocs}
            defaultDocIndex={selectedDocIndex}
            onClose={handleFileCarouselClose}
          />
        )}
        <ApproveInvoicesPrompt
          isOpen={isApprovePromptOpen}
          isApproved={isApprovalFinished}
          isLoading={isApprovalLoading}
          onApprove={handleApprove}
          onClose={handleApprovePromptClose}
        />
        <DeclineInvoicesPrompt
          isOpen={isDeclinePromptOpen}
          onDecline={handleDecline}
          onClose={handleDeclinePromptClose}
        />
      </div>
    </>
  );
};

export default InvoiceAcceptanceContainer;
