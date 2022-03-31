import React, { FC } from "react";
import { ButtonLink } from "@/shared/components";
import RightArrowIcon from "@/shared/icons/rightArrow.icon";
import "./index.scss";

interface HistoryListItemProps {
  title: string;
  description?: string;
  amount: string;
  onClick?: () => void;
}

const HistoryListItem: FC<HistoryListItemProps> = (props) => {
  const { title, description, amount, onClick } = props;

  const contentEl = (
    <>
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
      <span className="my-contributions-stage-history-list-item__amount">
        {amount}
        {onClick && (
          <RightArrowIcon className="my-contributions-stage-history-list-item__right-arrow" />
        )}
      </span>
    </>
  );

  return (
    <li className="my-contributions-stage-history-list-item-wrapper">
      {onClick ? (
        <ButtonLink
          className="my-contributions-stage-history-list-item my-contributions-stage-history-list-item--clickable"
          onClick={onClick}
        >
          {contentEl}
        </ButtonLink>
      ) : (
        <div className="my-contributions-stage-history-list-item">
          {contentEl}
        </div>
      )}
    </li>
  );
};

export default HistoryListItem;
