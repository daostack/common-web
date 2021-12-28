import React, { FC } from "react";
import classNames from "classnames";
import { ButtonIcon } from "../../../shared/components";
import TrashIcon from "../../../shared/icons/trash.icon";
import { formatPrice } from "../../../shared/utils";
import "./index.scss";

export enum InvoiceTileVariant {
  Square,
  FullWidth,
}

interface InvoiceTileProps {
  className?: string;
  fileURL: string;
  fileName: string;
  isImage: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  amount?: number | null;
  variant?: InvoiceTileVariant;
}

const InvoiceTile: FC<InvoiceTileProps> = (props) => {
  const {
    className,
    fileURL,
    fileName,
    isImage,
    onClick,
    onDelete,
    amount = null,
    variant = InvoiceTileVariant.Square,
  } = props;
  const isFullWidthVariant = variant === InvoiceTileVariant.FullWidth;

  const amountEl = amount !== null && (
    <span
      className={classNames("invoice-tile__amount", {
        "invoice-tile__amount--static invoice-tile__amount--purple": isFullWidthVariant,
      })}
    >
      Amount: {formatPrice(amount)}
    </span>
  );
  const deleteButtonEl = onDelete && (
    <ButtonIcon
      className={classNames("invoice-tile__delete-button", {
        "invoice-tile__delete-button--static": isFullWidthVariant,
      })}
      onClick={onDelete}
    >
      <TrashIcon className="invoice-tile__delete-icon" />
    </ButtonIcon>
  );

  const shouldDisplayTopContent =
    isFullWidthVariant && (amountEl || deleteButtonEl);

  const imageClassName = classNames("invoice-tile__image", {
    "invoice-tile__image--full-width": isFullWidthVariant,
    "invoice-tile__image--general-file": !isImage,
  });

  return (
    <div
      className={classNames(
        "invoice-tile",
        { "invoice-tile--full-width": isFullWidthVariant },
        className
      )}
      onClick={onClick}
      tabIndex={0}
    >
      {shouldDisplayTopContent && (
        <div className="invoice-tile__top-content-wrapper">
          {amountEl}
          {deleteButtonEl}
        </div>
      )}
      {isImage ? (
        <img className={imageClassName} src={fileURL} alt={fileName} />
      ) : (
        <div className={imageClassName}>{fileName}</div>
      )}
      {!isFullWidthVariant && (
        <>
          {deleteButtonEl}
          {amountEl}
        </>
      )}
    </div>
  );
};

export default InvoiceTile;
