import React, { FC, useMemo } from "react";
import { TreeRecursive } from "./components";
import { TreeContext, TreeContextValue } from "./context";
import { Item } from "./types";

interface ProjectsTreeProps {
  items: Item[];
}

const ProjectsTree: FC<ProjectsTreeProps> = (props) => {
  const { items } = props;
  const activeItemId = "";
  const contextValue = useMemo<TreeContextValue>(
    () => ({
      activeItemId,
    }),
    [activeItemId],
  );

  return (
    <TreeContext.Provider value={contextValue}>
      <TreeRecursive items={items} />
    </TreeContext.Provider>
  );
};

export default ProjectsTree;
