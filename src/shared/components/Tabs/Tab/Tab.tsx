import React, { useCallback, FC } from "react";
import classNames from "classnames";
import { useTabContext } from "../context";
import { getPanelId, getLabelId } from "../helpers";
import "./index.scss";

interface TabProps {
  className?: string;
  label: string;
  value: unknown;
  includeDefaultMobileStyles?: boolean;
}

const Tab: FC<TabProps> = (props) => {
  const { className, label, value, includeDefaultMobileStyles = true } = props;
  const { value: currentValue, onChange, panelIdTemplate } = useTabContext();
  const isActive = value === currentValue;
  const panelId = getPanelId(value, panelIdTemplate);
  const labelId = getLabelId(panelId);

  const handleChange = useCallback(() => {
    onChange(value, labelId);
  }, [onChange, value, labelId]);

  const buttonClassName = classNames(
    "custom-tab",
    {
      "custom-tab--active": isActive,
      "custom-tab--default-mobile": includeDefaultMobileStyles,
    },
    className,
  );

  return (
    <button
      className={buttonClassName}
      id={labelId}
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
