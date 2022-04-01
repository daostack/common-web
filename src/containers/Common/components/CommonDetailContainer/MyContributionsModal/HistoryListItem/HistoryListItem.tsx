import React, { FC } from "react";
import classNames from "classnames";
import { ButtonLink } from "@/shared/components";
import RightArrowIcon from "@/shared/icons/rightArrow.icon";
import "./index.scss";

export interface Styles {
  item?: string;
  title?: string;
}

interface HistoryListItemProps {
  title: string;
  description?: string;
  amount: string;
  onClick?: () => void;
  styles?: Styles;
}

const HistoryListItem: FC<HistoryListItemProps> = (props) => {
  const { title, description, amount, onClick, styles } = props;

  const itemClassName = classNames(
    "my-contributions-stage-history-list-item",
    styles?.item,
    {
      "my-contributions-stage-history-list-item--clickable": onClick,
    }
  );

  const contentEl = (
    <>
      <div className="my-contributions-stage-history-list-item__content">
        <p
          className={classNames(
            "my-contributions-stage-history-list-item__title",
            styles?.title
          )}
        >
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
        <ButtonLink className={itemClassName} onClick={onClick}>
          {contentEl}
        </ButtonLink>
      ) : (
        <div className={itemClassName}>{contentEl}</div>
      )}
    </li>
  );
};

export default HistoryListItem;
