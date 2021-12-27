import React, { FC } from "react";
import { useSelector } from "react-redux";
import { ScreenSize } from "../../../../shared/constants";
import { InvoiceTile, InvoiceTileVariant } from "../../../../shared/components";
import { getScreenSize } from "../../../../shared/store/selectors";
import { formatPrice } from "../../../../shared/utils";
import "./index.scss";

interface LegalDoc {
  name: string;
  legalType: number;
  amount: number;
  mimeType: string;
  downloadURL: string;
}

interface InvoiceApprovalItemProps {
  title: string;
  description: string;
  amount: number;
  legalDocs: LegalDoc[];
}

const InvoiceApprovalItem: FC<InvoiceApprovalItemProps> = (props) => {
  const { title, description, amount, legalDocs } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  return (
    <div className="invoice-approval-item-wrapper">
      <div className="invoice-approval-item-wrapper__proposal-info-wrapper">
        <div>
          <h4 className="invoice-approval-item-wrapper__title">{title}</h4>
          <p className="invoice-approval-item-wrapper__description">
            {description}
          </p>
        </div>
        <span>{formatPrice(amount)}</span>
      </div>
      <ul className="invoice-approval-item-wrapper__invoices">
        {legalDocs.map((legalDoc, index) => (
          <li key={index} className="invoice-approval-item-wrapper__invoice">
            <InvoiceTile
              imageSrc={legalDoc.downloadURL}
              alt={legalDoc.name}
              amount={legalDoc.amount}
              variant={
                isMobileView
                  ? InvoiceTileVariant.FullWidth
                  : InvoiceTileVariant.Square
              }
            />
          </li>
        ))}
      </ul>
      <div className="invoice-approval-item-wrapper__buttons">
        <button className="button-blue invoice-approval-item-wrapper__accept-button">
          Accept
        </button>
        <button className="button-blue invoice-approval-item-wrapper__decline-button">
          Decline
        </button>
      </div>
    </div>
  );
};

export default InvoiceApprovalItem;
