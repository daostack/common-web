import React, { FC } from "react";
import classNames from "classnames";
import { formatPrice } from "../../../shared/utils";
import "./index.scss";

interface InvoiceTileProps {
  className?: string;
  imageSrc: string;
  alt: string;
  amount?: number | null;
}

const InvoiceTile: FC<InvoiceTileProps> = (props) => {
  const { className, imageSrc, alt, amount = null } = props;

  return (
    <div className={classNames("invoice-tile", className)}>
      <img className="invoice-tile__image" src={imageSrc} alt={alt} />
      {amount !== null && <div className="invoice-tile__amount">Amount: {formatPrice(amount)}</div>}
    </div>
  );
};

export default InvoiceTile;
