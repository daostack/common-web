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
      className="supporters-page-selection-button"
      type="button"
      onClick={onClick}
    >
      <span
        className={classNames("supporters-page-selection-button__circle", {
          "supporters-page-selection-button__circle--active": isActive,
        })}
      />
      {children}
    </button>
  );
};

export default SelectionButton;
