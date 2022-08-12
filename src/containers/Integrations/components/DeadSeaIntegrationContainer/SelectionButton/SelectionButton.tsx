import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

interface SelectionButtonProps {
  isActive: boolean;
  onClick: () => void;
}

const SelectionButton: FC<SelectionButtonProps> = (props) => {
  const { isActive, onClick, children } = props;

  return (
    <button
      className="dead-sea-selection-button"
      type="button"
      onClick={onClick}
    >
      <span
        className={classNames("dead-sea-selection-button__circle", {
          "dead-sea-selection-button__circle--active": isActive,
        })}
      />
      {children}
    </button>
  );
};

export default SelectionButton;
