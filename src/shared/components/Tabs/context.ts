import React, { useContext } from "react";
import { DEFAULT_PANEL_ID_TEMPLATE } from "./constants";

export interface TabContextValue {
  value?: unknown;
  onChange: (value: unknown, itemId: string) => void;
  panelIdTemplate?: string;
  withIcons?: boolean;
}

export const TabContext = React.createContext<TabContextValue>({
  onChange: () => {
    throw new Error(
      'Please use tab related components inside "Tabs" component',
    );
  },
  panelIdTemplate: DEFAULT_PANEL_ID_TEMPLATE,
  withIcons: false,
});

export const useTabContext = () => useContext(TabContext);
