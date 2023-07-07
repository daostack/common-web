import React, { useContext } from "react";

export interface TreeItemTriggerStyles {
  container?: string;
  containerActive?: string;
  name?: string;
  image?: string;
  imageNonRounded?: string;
}

export interface TreeContextValue {
  activeItemId?: string;
  itemIdWithNewProjectCreation?: string;
  isActiveCheckAllowed: boolean;
  treeItemTriggerStyles?: TreeItemTriggerStyles;
  onAddProjectClick?: (commonId: string) => void;
}

export const TreeContext = React.createContext<TreeContextValue>({
  isActiveCheckAllowed: true,
});

export const useTreeContext = (): TreeContextValue => useContext(TreeContext);
