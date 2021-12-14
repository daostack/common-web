import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../Auth/store/selectors";
import { AddInvoices } from "../../components/AddInvoices";
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
      <span>{`Hi ${user?.displayName}`}</span>
      <span>{`Please add all of your invoices related to this ${expense}`}</span>
      <AddInvoices />
    </div>
  )
}
