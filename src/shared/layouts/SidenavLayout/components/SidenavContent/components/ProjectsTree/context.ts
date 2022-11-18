import React, { useContext } from "react";

export interface TreeContextValue {
  activeItemId?: string;
}

export const TreeContext = React.createContext<TreeContextValue>({});

export const useTreeContext = (): TreeContextValue => useContext(TreeContext);
