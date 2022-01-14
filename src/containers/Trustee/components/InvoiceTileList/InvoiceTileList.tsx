import React, { FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { InvoiceTile, InvoiceTileVariant } from "../../../../shared/components";
import { ScreenSize } from "../../../../shared/constants";
import DownloadIcon from "../../../../shared/icons/download.icon";
import { DocInfo } from "../../../../shared/models";
import { getScreenSize } from "../../../../shared/store/selectors";
import "./index.scss";

interface InvoiceTileListProps {
  className?: string;
  payoutDocs: DocInfo[];
  onDocClick?: (doc: DocInfo) => void;
}

const InvoiceTileList: FC<InvoiceTileListProps> = (props) => {
  const { className, payoutDocs, onDocClick } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  return (
    <section className={classNames("invoice-tile-list-wrapper", className)}>
      {payoutDocs.length === 0 && (
        <span className="invoice-tile-list-wrapper__no-uploaded-docs-text">
          There are no uploaded invoices
        </span>
      )}
      {payoutDocs.length > 0 && (
        <>
          <div className="invoice-tile-list-wrapper__header-info">
            <span>
              {payoutDocs.length}
              {` Invoice${payoutDocs.length === 1 ? "" : "s"}`}
            </span>
            <span className="invoice-tile-list-wrapper__download-all-link">
              <DownloadIcon />
              Download all invoices
            </span>
          </div>
          <div className="invoice-tile-list-wrapper__invoices-wrapper">
            {payoutDocs.map((doc, index) => (
              <InvoiceTile
                key={index}
                className="invoice-tile-list-wrapper__invoice-tile"
                fileURL={doc.downloadURL}
                fileName={doc.name}
                isImage={doc.mimeType.startsWith("image/")}
                amount={doc.amount || 0}
                variant={
                  isMobileView
                    ? InvoiceTileVariant.FullWidth
                    : InvoiceTileVariant.Square
                }
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default InvoiceTileList;
