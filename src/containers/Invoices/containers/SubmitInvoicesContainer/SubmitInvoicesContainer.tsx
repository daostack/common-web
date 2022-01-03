import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../Auth/store/selectors";
import { AddInvoices } from "../../components/AddInvoices";
import ApprovedIcon from "../../../../shared/icons/approved.icon";
import { useParams } from "react-router-dom";
import { fetchProposal } from "../../api";
import { Loader } from "../../../../shared/components";
import { Proposal } from "../../../../shared/models";
import { formatPrice, formatEpochTime } from "../../../../shared/utils";
import { fetchCommonDetail } from "../../../Common/store/api";
import "./index.scss";

interface AddInvoicesRouterParams {
  proposalId: string;
}

enum Expense {
  proposal = "proposal",
}

enum SubmissionStatus {
  Loading,
  PendingUser,
  Submitted,
}

export default function SubmitInvoicesContainer() {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(SubmissionStatus.Loading);
  const { proposalId } = useParams<AddInvoicesRouterParams>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [commonName, setCommonName] = useState("");
  const user = useSelector(selectUser());
  const expense: Expense = Expense.proposal;

  useEffect(() => {
    (async () => {
      try {
        const proposal = await fetchProposal(proposalId);
        console.log(proposal);
        if (proposal.hasLegalDocs || (proposal.payoutDocs && proposal.payoutDocs?.length > 0)) {
          setSubmissionStatus(SubmissionStatus.Submitted);
        } else {
          setProposal(proposal);
          const commonProposal = await fetchCommonDetail(proposal.commonId);
          setCommonName(commonProposal.name);
          setSubmissionStatus(SubmissionStatus.PendingUser);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [proposalId])

  return (
    <div className="submit-invoices-wrapper">
      {submissionStatus === SubmissionStatus.Loading ? <Loader className="loader" /> : submissionStatus === SubmissionStatus.PendingUser ? (
        <>
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
                {`${formatPrice(proposal?.fundingRequest?.amount, true)}`}
              </span>
            </div>
          </div>
          <AddInvoices
            proposalId={proposalId}
            className="submit-invoices-wrapper__add-invoice"
            proposalRequest={proposal?.fundingRequest?.amount}
            updateSubmissionStatus={() => setSubmissionStatus(SubmissionStatus.Submitted)} />
        </>
      ) : "Already submitted"}
    </div>
  )
}
