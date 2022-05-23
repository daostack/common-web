import React, { useMemo, FC } from "react";
import classNames from "classnames";
import { ROUTE_PATHS } from "@/shared/constants";
import ApprovedIcon from "@/shared/icons/approved.icon";
import { Common, DateFormat, Proposal, User } from "@/shared/models";
import { formatEpochTime, formatPrice, getUserName } from "@/shared/utils";
import {
  checkDeclinedProposal,
  checkPendingApprovalProposal,
} from "../../helpers";
import "./index.scss";

interface ProposalCardProps {
  proposal: Proposal;
  common?: Common;
  user?: User;
  withAdditionalData?: boolean;
  onClick?: () => void;
}

const ProposalCard: FC<ProposalCardProps> = (props) => {
  const { proposal, common, user, withAdditionalData = false, onClick } = props;
  const isPendingApproval = checkPendingApprovalProposal(proposal);
  const isDeclined = checkDeclinedProposal(proposal);
  const isApproved = !isPendingApproval && !isDeclined;
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
          {withAdditionalData && (
            <div className="trustee-proposal-card__extended-data-wrapper">
              <p className="trustee-proposal-card__extended-data">
                Common name:{" "}
                {common ? (
                  <a
                    href={ROUTE_PATHS.COMMON_DETAIL.replace(":id", common.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {common.name}
                  </a>
                ) : (
                  "-"
                )}
              </p>
              <p className="trustee-proposal-card__extended-data">
                Proposer name: {user ? getUserName(user) : "-"}
              </p>
            </div>
          )}
          <h3
            className="trustee-proposal-card__title"
            title={proposal.description.title}
          >
            {proposal.description.title}
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
