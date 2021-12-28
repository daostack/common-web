import React, { useCallback, FC, MouseEventHandler } from "react";
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
  shouldDownloadOnClick?: boolean;
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
    shouldDownloadOnClick = false,
    amount = null,
    variant = InvoiceTileVariant.Square,
  } = props;
  const isFullWidthVariant = variant === InvoiceTileVariant.FullWidth;

  const onTileClick = useCallback<MouseEventHandler>(
    (event) => {
      if (!shouldDownloadOnClick && onClick) {
        event.preventDefault();
        onClick();
      }
    },
    [shouldDownloadOnClick, onClick]
  );

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

  const additionalProps = shouldDownloadOnClick
    ? {
        href: fileURL,
        target: "_blank",
      }
    : {};

  return (
    <div
      className={classNames(
        "invoice-tile",
        { "invoice-tile--full-width": isFullWidthVariant },
        className
      )}
    >
      {shouldDisplayTopContent && (
        <div className="invoice-tile__top-content-wrapper">
          {amountEl}
          {deleteButtonEl}
        </div>
      )}
      <a
        className="invoice-tile__image-wrapper"
        onClick={onTileClick}
        {...additionalProps}
      >
        {isImage ? (
          <img className={imageClassName} src={fileURL} alt={fileName} />
        ) : (
          <div className={imageClassName}>{fileName}</div>
        )}
      </a>
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
