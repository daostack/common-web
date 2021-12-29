import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../Auth/store/selectors";
import { AddInvoices } from "../../components/AddInvoices";
import ApprovedIcon from "../../../../shared/icons/approved.icon";
import { useParams } from "react-router-dom";
import { fetchProposal } from "../../api";
import { Loader } from "../../../../shared/components";
import { Proposal } from "../../../../shared/models";
import { formatPrice } from "../../../../shared/utils";
import "./index.scss";
import { fetchCommonDetail } from "../../../Common/store/api";

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
        if (proposal.legalDocsInfo) {
          if (proposal.legalDocsInfo.length > 0) {
            setSubmissionStatus(SubmissionStatus.Submitted);
          } else {
            setProposal(proposal);
            const commonProposal = await fetchCommonDetail(proposal.commonId);
            setCommonName(commonProposal.name);
            setSubmissionStatus(SubmissionStatus.PendingUser);
          }
        } else { // TODO: temporary until the legalDocsInfo will be updated in the backend
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
              <span>{`Approved on ${"APPROVAL_DATE"}`}</span>
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
            proposalRequest={proposal?.fundingRequest?.amount} />
        </>
      ) : "Already submitted"}
    </div>
  )
}
