import React, { useContext } from "react";

export interface TreeContextValue {
  activeItemId?: string;
  itemIdWithNewProjectCreation?: string;
  treeItemTriggerClassName?: string;
  treeItemTriggerNameClassName?: string;
}

export const TreeContext = React.createContext<TreeContextValue>({});

export const useTreeContext = (): TreeContextValue => useContext(TreeContext);
