import React, { useMemo, FC } from "react";
import classNames from "classnames";
import ApprovedIcon from "../../../../shared/icons/approved.icon";
import { DateFormat, Proposal, ProposalState } from "../../../../shared/models";
import { formatEpochTime, formatPrice } from "../../../../shared/utils";
import "./index.scss";

interface ProposalCardProps {
  proposal: Proposal;
  onClick?: () => void;
}

const ProposalCard: FC<ProposalCardProps> = (props) => {
  const { proposal, onClick } = props;
  const isApproved = proposal.state === ProposalState.PASSED;
  const isDeclined = Boolean(proposal.payoutDocsRejectionReason);
  const invoicesTotal = useMemo(
    () =>
      (proposal.payoutDocs || []).reduce(
        (acc, doc) => acc + (doc.amount || 0),
        0
      ),
    [proposal.payoutDocs]
  );

  const containerClassName = classNames("trustee-proposal-card", {
    "trustee-proposal-card--without-action": !onClick,
  });
  const approvalDateClassName = classNames(
    "trustee-proposal-card__approval-date",
    {
      "trustee-proposal-card__approval-date--approved": isApproved,
      "trustee-proposal-card__approval-date--declined": isDeclined,
    }
  );
  const priceWrapperClassName = classNames(
    "trustee-proposal-card__price-wrapper",
    {
      "trustee-proposal-card__price-wrapper--approved": isApproved,
      "trustee-proposal-card__price-wrapper--declined": isDeclined,
    }
  );

  return (
    <div className={containerClassName}>
      <span className={approvalDateClassName}>
        <ApprovedIcon className="trustee-proposal-card__approval-icon" />
        <span>
          Approved on{" "}
          {proposal.approvalDate
            ? formatEpochTime(proposal.approvalDate, DateFormat.Human)
            : "UNKNOWN"}
        </span>
      </span>
      <div className="trustee-proposal-card__content-wrapper">
        <div className="trustee-proposal-card__content">
          <h3
            className="trustee-proposal-card__title"
            title={proposal.description.description}
          >
            {proposal.description.description}
          </h3>
          <div className="trustee-proposal-card__prices-wrapper">
            <div className={priceWrapperClassName}>
              <span>Proposal Requested</span>
              <span className="trustee-proposal-card__price">
                {formatPrice(proposal.fundingRequest?.amount)}
              </span>
            </div>
            <div className={priceWrapperClassName}>
              <span>Invoices Total</span>
              <span className="trustee-proposal-card__price">
                {formatPrice(invoicesTotal)}
              </span>
            </div>
          </div>
          <p
            className="trustee-proposal-card__note"
            title={proposal.payoutDocsComment}
          >
            {proposal.payoutDocsComment && (
              <>
                <strong>Note: </strong>
                {proposal.payoutDocsComment}
              </>
            )}
          </p>
        </div>
        {onClick && (
          <button
            className="button-blue trustee-proposal-card__view-button"
            onClick={onClick}
          >
            View Invoices
          </button>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;
