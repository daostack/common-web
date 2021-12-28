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
}

const InvoiceApprovalItem: FC<InvoiceApprovalItemProps> = (props) => {
  const { title, description, amount, legalDocsInfo } = props;
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
        {legalDocsInfo.map((legalDocInfo, index) => (
          <li key={index} className="invoice-approval-item-wrapper__invoice">
            <InvoiceTile
              imageSrc={legalDocInfo.downloadURL}
              alt={legalDocInfo.name}
              amount={legalDocInfo.amount}
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
