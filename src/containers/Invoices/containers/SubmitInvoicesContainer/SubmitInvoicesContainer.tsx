import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../Auth/store/selectors";
import { AddInvoices } from "../../components/AddInvoices";
import ApprovedIcon from "../../../../shared/icons/approved.icon";
import { useParams } from "react-router-dom";
import { fetchProposal } from "../../api";
import "./index.scss";
import { Loader } from "../../../../shared/components";
import { Proposal } from "../../../../shared/models";
import { formatPrice } from "../../../../shared/utils";

enum Expense {
  proposal = "proposal",
}

interface AddInvoicesRouterParams {
  proposalId: string;
}

export default function SubmitInvoicesContainer() {
  const [loading, setLoading] = useState(true);
  const { proposalId } = useParams<AddInvoicesRouterParams>();
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const user = useSelector(selectUser());
  const expense: Expense = Expense.proposal;

  useEffect(() => {
    (async () => {
      try {
        const proposal = await fetchProposal(proposalId);
        console.log(proposal);
        setProposal(proposal);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [proposalId])

  return (
    <div className="submit-invoices-wrapper">
      {loading ? <Loader className="loader" /> : (
        <>
          <h2 className="submit-invoices-wrapper__common-name">{`${"COMMON_NAME"}`}</h2>
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
            className="submit-invoices-wrapper__add-invoice"
            proposalRequest={proposal?.fundingRequest?.amount} />
        </>
      )}
    </div>
  )
}
