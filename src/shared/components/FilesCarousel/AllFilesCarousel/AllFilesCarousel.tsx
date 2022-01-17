import React, { FC } from "react";
import classNames from "classnames";
import DownloadIcon from "../../../icons/download.icon";
import LeftArrowIcon from "../../../icons/leftArrow.icon";
import RightArrowIcon from "../../../icons/rightArrow.icon";
import { DocInfo } from "../../../models";
import { ButtonIcon } from "../../ButtonIcon";
import { InvoiceTile } from "../../InvoiceTile";
import "./index.scss";

interface AllFilesCarouselProps {
  className?: string;
  payoutDocs: DocInfo[];
  currentDocIndex?: number | null;
  onDocClick?: (doc: DocInfo, index: number) => void;
}

const AllFilesCarousel: FC<AllFilesCarouselProps> = (props) => {
  const { className, payoutDocs, currentDocIndex, onDocClick } = props;

  const contentWrapperClassName = classNames(
    "all-files-carousel-wrapper__content-wrapper",
    {
      "all-files-carousel-wrapper__content-wrapper--without-actions": false,
    }
  );
  return (
    <div className={classNames("all-files-carousel-wrapper", className)}>
      <div className="all-files-carousel-wrapper__header">
        <span>
          {payoutDocs.length}
          {` Invoice${payoutDocs.length === 1 ? "" : "s"}`}
        </span>
        <span className="all-files-carousel-wrapper__download-all">
          <DownloadIcon />
          Download all invoices
        </span>
      </div>
      <div className={contentWrapperClassName}>
        <ButtonIcon className="all-files-carousel-wrapper__button-icon">
          <LeftArrowIcon className="all-files-carousel-wrapper__icon" />
        </ButtonIcon>
        <div className="all-files-carousel-wrapper__content">
          {payoutDocs.map((doc, index) => {
            const isActive = currentDocIndex === index;
            const className = classNames(
              "all-files-carousel-wrapper__invoice-tile",
              {
                "all-files-carousel-wrapper__invoice-tile--active": isActive,
              }
            );
            const imageClassName = classNames(
              "all-files-carousel-wrapper__invoice-tile-image",
              {
                "all-files-carousel-wrapper__invoice-tile-image--active": isActive,
              }
            );

            return (
              <InvoiceTile
                key={index}
                className={className}
                fileURL={doc.downloadURL}
                fileName={doc.name}
                isImage={doc.mimeType.startsWith("image/")}
                styles={{
                  image: imageClassName,
                }}
                onClick={() => onDocClick && onDocClick(doc, index)}
              />
            );
          })}
        </div>
        <ButtonIcon className="all-files-carousel-wrapper__button-icon">
          <RightArrowIcon className="all-files-carousel-wrapper__icon" />
        </ButtonIcon>
      </div>
    </div>
  );
};

export default AllFilesCarousel;
