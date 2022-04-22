import React, { FC } from "react";
import "./index.scss";

interface CollectionSummaryCardProps {
  collectionName: string;
  collectionLength: number;
  iconSrc: string;
  iconAlt: string;
}

const CollectionSummaryCard: FC<CollectionSummaryCardProps> = (
  {
    collectionName,
    collectionLength,
    iconSrc,
    iconAlt,
  }
) => (
  <div className="summary-card">
    <div className="summary-card_info">
      <span className="summary-card_info-amount">
        {collectionLength}
      </span>
      <span className="summary-card_info-title">
        {collectionName}
      </span>
    </div>
    <img
      src={iconSrc}
      alt={iconAlt}
      className="summary-card_icon"
    />
  </div>
);

export default CollectionSummaryCard;
