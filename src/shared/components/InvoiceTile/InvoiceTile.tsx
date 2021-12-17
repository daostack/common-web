import React, { FC } from "react";
import classNames from "classnames";
import { ButtonIcon } from "../../../shared/components";
import TrashIcon from "../../../shared/icons/trash.icon";
import { formatPrice } from "../../../shared/utils";
import "./index.scss";

interface InvoiceTileProps {
  className?: string;
  imageSrc: string;
  alt: string;
  onDelete?: () => void;
  amount?: number | null;
}

const InvoiceTile: FC<InvoiceTileProps> = (props) => {
  const { className, imageSrc, alt, onDelete, amount = null } = props;

  return (
    <div className={classNames("invoice-tile", className)}>
      <img className="invoice-tile__image" src={imageSrc} alt={alt} />
      {onDelete && (
        <ButtonIcon className="invoice-tile__delete-button" onClick={onDelete}>
          <TrashIcon className="invoice-tile__delete-icon" />
        </ButtonIcon>
      )}
      {amount !== null && (
        <div className="invoice-tile__amount">
          Amount: {formatPrice(amount)}
        </div>
      )}
    </div>
  );
};

export default InvoiceTile;
