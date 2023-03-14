import React, { useContext } from "react";

export interface TreeItemTriggerStyles {
  container?: string;
  name?: string;
  image?: string;
  imageNonRounded?: string;
}

export interface TreeContextValue {
  activeItemId?: string;
  itemIdWithNewProjectCreation?: string;
  treeItemTriggerStyles?: TreeItemTriggerStyles;
}

export const TreeContext = React.createContext<TreeContextValue>({});

export const useTreeContext = (): TreeContextValue => useContext(TreeContext);
