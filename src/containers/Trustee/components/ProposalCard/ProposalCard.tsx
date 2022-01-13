import React, { FC } from "react";
import classNames from "classnames";
import ApprovedIcon from "../../../../shared/icons/close.icon";
// import ApprovedIcon from "../../../../shared/icons/approved.icon";
import { Proposal } from "../../../../shared/models";
import { formatPrice } from "../../../../shared/utils";
import "./index.scss";

interface ProposalCardProps {
  proposal: Proposal;
  onClick: () => void;
}

const ProposalCard: FC<ProposalCardProps> = (props) => {
  const { proposal, onClick } = props;
  const isApproved = false;
  const isDeclined = false;
  const note = "I was able to get some discount :)";

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
    <div className="trustee-proposal-card">
      <span className={approvalDateClassName}>
        <ApprovedIcon className="trustee-proposal-card__approval-icon" />
        <span>Approved on Nov, 21 2021</span>
      </span>
      <div className="trustee-proposal-card__content-wrapper">
        <div className="trustee-proposal-card__content">
          <h3 className="trustee-proposal-card__title">
            {proposal.description.description}
          </h3>
          <div className="trustee-proposal-card__prices-wrapper">
            <div className={priceWrapperClassName}>
              <span>Proposal Requested</span>
              <span className="trustee-proposal-card__price">
                {formatPrice(proposal.funding?.amount)}
              </span>
            </div>
            <div className={priceWrapperClassName}>
              <span>Invoices Total</span>
              <span className="trustee-proposal-card__price">
                {formatPrice(87078)}
              </span>
            </div>
          </div>
          {note && (
            <p className="trustee-proposal-card__note">
              <strong>Note: </strong>
              {note}
            </p>
          )}
        </div>
        <button
          className="button-blue trustee-proposal-card__view-button"
          onClick={onClick}
        >
          View Invoices
        </button>
      </div>
    </div>
  );
};

export default ProposalCard;
