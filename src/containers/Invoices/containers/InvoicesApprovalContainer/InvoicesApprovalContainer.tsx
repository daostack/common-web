import React, { FC } from "react";
import { InvoiceApprovalItem } from "../../components/InvoiceApprovalItem";
import "./index.scss";

const InvoicesApprovalContainer: FC = () => {
  return (
    <div className="invoices-approval-wrapper">
      <ul className="invoices-approval-wrapper__items">
        <li className="invoices-approval-wrapper__item">
          <InvoiceApprovalItem
            title="Proposal Title"
            description="Proposal Description"
            amount={13000}
            legalDocs={[
              {
                name: "file_name.jpg",
                legalType: 2,
                amount: 5000,
                mimeType: "image/jpg",
                downloadURL: "https://upload.wikimedia.org/wikipedia/commons/0/0b/ReceiptSwiss.jpg",
              },
              {
                name: "file_name.jpg",
                legalType: 2,
                amount: 5000,
                mimeType: "image/jpg",
                downloadURL: "https://upload.wikimedia.org/wikipedia/commons/0/0b/ReceiptSwiss.jpg",
              },
              {
                name: "file_name.jpg",
                legalType: 2,
                amount: 5000,
                mimeType: "image/jpg",
                downloadURL: "https://upload.wikimedia.org/wikipedia/commons/0/0b/ReceiptSwiss.jpg",
              },
              {
                name: "file_name.jpg",
                legalType: 2,
                amount: 5000,
                mimeType: "image/jpg",
                downloadURL: "https://upload.wikimedia.org/wikipedia/commons/0/0b/ReceiptSwiss.jpg",
              },
              {
                name: "file_name.jpg",
                legalType: 2,
                amount: 5000,
                mimeType: "image/jpg",
                downloadURL: "https://upload.wikimedia.org/wikipedia/commons/0/0b/ReceiptSwiss.jpg",
              },
            ]}
          />
        </li>
      </ul>
    </div>
  );
};

export default InvoicesApprovalContainer;
