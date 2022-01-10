import React, { useCallback, FC } from "react";
import classNames from "classnames";
import { DEFAULT_PANEL_ID_TEMPLATE } from "../constants";
import { useTabContext } from "../context";
import "./index.scss";

interface TabProps {
  className?: string;
  label: string;
  value: unknown;
}

const Tab: FC<TabProps> = (props) => {
  const { className, label, value } = props;
  const { value: currentValue, onChange, panelIdTemplate } = useTabContext();
  const isActive = value === currentValue;
  const panelId = `${panelIdTemplate || DEFAULT_PANEL_ID_TEMPLATE}-${value}`;

  const handleChange = useCallback(() => {
    onChange(value);
  }, [onChange, value]);

  const buttonClassName = classNames(
    "custom-tab",
    { "custom-tab--active": isActive },
    className
  );

  return (
    <button
      className={buttonClassName}
      tabIndex={0}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      onClick={handleChange}
    >
      {label}
    </button>
  );
};

export default Tab;
