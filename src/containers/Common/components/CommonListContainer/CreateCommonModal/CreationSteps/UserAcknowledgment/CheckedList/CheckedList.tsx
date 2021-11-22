import React, { ReactElement, ReactNode } from "react";
import classNames from "classnames";
import CheckIcon from "../../../../../../../../shared/icons/check.icon";
import "./index.scss";

interface CheckedListProps {
  className?: string;
  items: ReactNode[];
}

export default function CheckedList({ className, items }: CheckedListProps): ReactElement | null {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className={classNames("create-common-checked-list", className)}>
      {items.map((item, index) => (
        <li key={index} className="create-common-checked-list__item">
          <CheckIcon className="create-common-checked-list__icon" />
          <div>{item}</div>
        </li>
      ))}
    </ul>
  );
}
