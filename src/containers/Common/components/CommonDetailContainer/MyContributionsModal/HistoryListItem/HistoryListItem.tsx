import React, { FC } from "react";
import { formatPrice } from "@/shared/utils";
import "./index.scss";

interface HistoryListItemProps {
  title: string;
  description?: string;
  amount: number;
}

const HistoryListItem: FC<HistoryListItemProps> = (props) => {
  const { title, description, amount } = props;

  return (
    <li className="my-contributions-stage-history-list-item">
      <div className="my-contributions-stage-history-list-item__content">
        <p className="my-contributions-stage-history-list-item__title">
          {title}
        </p>
        {description && (
          <span className="my-contributions-stage-history-list-item__description">
            {description}
          </span>
        )}
      </div>
      <span>{formatPrice(amount, { shouldRemovePrefixFromZero: false })}</span>
    </li>
  );
};

export default HistoryListItem;
