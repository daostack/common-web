import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../Auth/store/selectors";
import { AddInvoices } from "../../components/AddInvoices";
import ApprovedIcon from "../../../../shared/icons/approved.icon";
import "./index.scss";

export default function InvoicesApprovalContainer() {
  return (
    <div className="invoices-approval-wrapper">
      InvoicesApprovalContainer
    </div>
  );
}
