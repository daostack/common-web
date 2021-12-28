import React, { useMemo, useState, FC } from "react";
import { FilePreview } from "../../components/FilePreview";
import { InvoiceApprovalItem } from "../../components/InvoiceApprovalItem";
import { Colors } from "../../../../shared/constants";
import { ButtonIcon } from "../../../../shared/components";
import CloseIcon from "../../../../shared/icons/close.icon";
import { LegalDocInfo } from "../../../../shared/models/Proposals";
import "./index.scss";

const InvoicesApprovalContainer: FC = () => {
  const [docForPreview, setDocForPreview] = useState<LegalDocInfo | null>(null);

  const topFilePreviewContent = useMemo(
    () => (
      <div className="invoices-approval-wrapper__file-preview-top-wrapper">
        <ButtonIcon
          className="invoices-approval-wrapper__file-preview-close-icon"
          onClick={() => setDocForPreview(null)}
        >
          <CloseIcon width={24} height={24} fill={Colors.white} />
        </ButtonIcon>
      </div>
    ),
    []
  );

  return (
    <div className="invoices-approval-wrapper">
      <ul className="invoices-approval-wrapper__items">
        <li className="invoices-approval-wrapper__item">
          <InvoiceApprovalItem
            title="Proposal Title"
            description="Proposal Description"
            amount={13000}
            onInvoiceClick={setDocForPreview}
            legalDocsInfo={[
              {
                name: "file_name.jpg",
                legalType: 2,
                amount: 5000,
                mimeType: "image/jpg",
                downloadURL:
                  "https://upload.wikimedia.org/wikipedia/commons/0/0b/ReceiptSwiss.jpg",
              },
              {
                name: "file_name.jpg",
                legalType: 2,
                amount: 5000,
                mimeType: "image/jpg",
                downloadURL:
                  "https://upload.wikimedia.org/wikipedia/commons/0/0b/ReceiptSwiss.jpg",
              },
              {
                name: "file_name.jpg",
                legalType: 2,
                amount: 5000,
                mimeType: "image/jpg",
                downloadURL:
                  "https://upload.wikimedia.org/wikipedia/commons/0/0b/ReceiptSwiss.jpg",
              },
              {
                name: "file_name.jpg",
                legalType: 2,
                amount: 5000,
                mimeType: "image/jpg",
                downloadURL:
                  "https://upload.wikimedia.org/wikipedia/commons/0/0b/ReceiptSwiss.jpg",
              },
              {
                name: "file_name.jpg",
                legalType: 2,
                amount: 5000,
                mimeType: "image/jpg",
                downloadURL:
                  "https://upload.wikimedia.org/wikipedia/commons/0/0b/ReceiptSwiss.jpg",
              },
            ]}
          />
        </li>
      </ul>
      {docForPreview && (
        <FilePreview
          fileURL={docForPreview.downloadURL}
          fileName={docForPreview.name}
          isImage={docForPreview.mimeType.startsWith("image/")}
          topContent={topFilePreviewContent}
        />
      )}
    </div>
  );
};

export default InvoicesApprovalContainer;
