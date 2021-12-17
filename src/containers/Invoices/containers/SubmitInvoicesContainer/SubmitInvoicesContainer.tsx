import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../Auth/store/selectors";
import { AddInvoices } from "../../components/AddInvoices";
import ApprovedIcon from "../../../../shared/icons/approved.icon";
import "./index.scss";

enum Expense {
  proposal = "proposal",
}

export default function SubmitInvoicesContainer() {
  const user = useSelector(selectUser());
  const expense: Expense = Expense.proposal;

  return (
    <div className="submit-invoices-wrapper">
      {/* <img src="/icons/logo.svg" alt="logo" className="logo" /> */}
      <span>{`Hi ${user?.displayName},`}</span>
      <span>{`Please add all of your invoices related to this ${expense}`}</span>
      <div className="submit-invoices-wrapper__description-wrapper">
        <span className="submit-invoices-wrapper__description-header">
          <ApprovedIcon className="submit-invoices-wrapper__description-approved-icon" />
          Approved on Nov, 21 2021
        </span>
        <div className="submit-invoices-wrapper__description-content">
          <span>Launch a facebook campaign to raise awareness about the amazon</span>
          <span className="submit-invoices-wrapper__description-amount">
            ₪950
          </span>
        </div>
      </div>
      <AddInvoices />
    </div>
  )
}
