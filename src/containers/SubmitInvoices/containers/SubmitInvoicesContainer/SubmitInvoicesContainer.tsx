import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../Auth/store/selectors";
import "./index.scss";

export default function SubmitInvoicesContainer() {
  const user = useSelector(selectUser());

  return (
    <div className="submit-invoices-wrapper">
      <img src="/icons/logo.svg" alt="logo" className="logo" />
      <div>{`Hello ${user?.displayName}`}</div>
    </div>
  )
}
