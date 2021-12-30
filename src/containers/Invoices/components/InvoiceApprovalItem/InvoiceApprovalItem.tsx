import React, { FC } from "react";
import { useSelector } from "react-redux";
import { ScreenSize } from "../../../../shared/constants";
import { InvoiceTile, InvoiceTileVariant } from "../../../../shared/components";
import { LegalDocInfo } from "../../../../shared/models";
import { getScreenSize } from "../../../../shared/store/selectors";
import { formatPrice } from "../../../../shared/utils";
import "./index.scss";

interface InvoiceApprovalItemProps {
  title: string;
  description: string;
  amount: number;
  legalDocsInfo: LegalDocInfo[];
  onInvoiceClick: (legalDocInfo: LegalDocInfo) => void;
  onDecline: () => void;
}

const InvoiceApprovalItem: FC<InvoiceApprovalItemProps> = (props) => {
  const {
    title,
    description,
    amount,
    legalDocsInfo,
    onInvoiceClick,
    onDecline,
  } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  return (
    <div className="invoice-approval-item-wrapper">
      <div className="invoice-approval-item-wrapper__proposal-info-wrapper">
        <h4 className="invoice-approval-item-wrapper__title">{title}</h4>
        <span>{formatPrice(amount)}</span>
      </div>
      <p className="invoice-approval-item-wrapper__description">
        {description}
      </p>
      <ul className="invoice-approval-item-wrapper__invoices">
        {legalDocsInfo.map((legalDocInfo, index) => {
          const isImage = legalDocInfo.mimeType.startsWith("image/");

          return (
            <li key={index} className="invoice-approval-item-wrapper__invoice">
              <InvoiceTile
                fileURL={legalDocInfo.downloadURL}
                fileName={legalDocInfo.name}
                isImage={isImage}
                amount={legalDocInfo.amount}
                variant={
                  isMobileView
                    ? InvoiceTileVariant.FullWidth
                    : InvoiceTileVariant.Square
                }
                onClick={() => onInvoiceClick(legalDocInfo)}
                shouldDownloadOnClick={!isImage}
              />
            </li>
          );
        })}
      </ul>
      <div className="invoice-approval-item-wrapper__buttons">
        <button className="button-blue invoice-approval-item-wrapper__accept-button">
          Accept
        </button>
        <button
          className="button-blue invoice-approval-item-wrapper__decline-button"
          onClick={onDecline}
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default InvoiceApprovalItem;
