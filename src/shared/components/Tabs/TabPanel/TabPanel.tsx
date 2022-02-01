import React, { FC } from "react";
import { getPanelId, getLabelId } from "../helpers";

interface TabPanelProps {
  value: unknown;
  panelValue: unknown;
  panelIdTemplate?: string;
}

const TabPanel: FC<TabPanelProps> = (props) => {
  const { value, panelValue, panelIdTemplate, children } = props;
  const panelId = getPanelId(panelValue, panelIdTemplate);
  const labelId = getLabelId(panelId);
  const isHidden = value !== panelValue;

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={labelId}
      hidden={isHidden}
    >
      {isHidden ? null : children}
    </div>
  );
};

export default TabPanel;
