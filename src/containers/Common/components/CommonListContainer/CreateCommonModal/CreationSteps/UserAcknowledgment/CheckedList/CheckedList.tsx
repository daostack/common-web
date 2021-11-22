import React, { ReactElement, ReactNode } from "react";
import CheckIcon from "../../../../../../../../shared/icons/check.icon";
import "./index.scss";

interface CheckedListProps {
  items: ReactNode[];
}

export default function CheckedList({ items }: CheckedListProps): ReactElement | null {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className="create-common-checked-list">
      {items.map((item, index) => (
        <li key={index} className="create-common-checked-list__item">
          <CheckIcon className="create-common-checked-list__icon" />
          <div>{item}</div>
        </li>
      ))}
    </ul>
  );
}
