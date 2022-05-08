import React from "react";
import ApprovedIcon from "../../../../shared/icons/approved.icon";
import {
  Proposal,
  User,
} from "../../../../shared/models";
import { formatEpochTime, formatPrice } from "../../../../shared/utils";
import { AddInvoices } from "../AddInvoices";
import "./index.scss";

interface IProps {
  commonName: string;
  user: User | null;
  proposal: Proposal | null;
  updateSubmissionStatus: () => void;
}

enum Expense {
  proposal = "proposal",
}

export default function ProposalDetails({ commonName, user, proposal, updateSubmissionStatus }: IProps) {
  const expense: Expense = Expense.proposal;

  return (
    <div className="proposal-detailes-wrapper">
      <h2 className="submit-invoices-wrapper__common-name">{`${commonName}`}</h2>
      <span className="submit-invoices-wrapper__welcome-text">Hi {user?.displayName ?? `${user?.firstName} ${user?.lastName}`},</span>
      <span className="submit-invoices-wrapper__welcome-text">Please add all of your invoices related to this {expense}</span>
      <div className="submit-invoices-wrapper__description-wrapper">
        <span className="submit-invoices-wrapper__description-header">
          <ApprovedIcon className="submit-invoices-wrapper__description-approved-icon" />
          <span>{`Approved on ${proposal?.approvalDate ? formatEpochTime(proposal.approvalDate) : "UNKNOWN"}`}</span>
        </span>
        <div className="submit-invoices-wrapper__description-content">
          <span className="submit-invoices-wrapper__description">{`${proposal?.description.description}`}</span>
          <span className="submit-invoices-wrapper__description-amount">
            {`${formatPrice(proposal?.fundingRequest?.amount, { shouldMillify: true })}`}
          </span>
        </div>
      </div>
      <AddInvoices
        proposalId={proposal?.id ?? ""}
        className="submit-invoices-wrapper__add-invoice"
        proposalRequest={proposal?.fundingRequest?.amount}
        updateSubmissionStatus={updateSubmissionStatus} />
    </div>
  )
}
