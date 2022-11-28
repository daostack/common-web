import React, { FC, useMemo } from "react";
import { TreeRecursive } from "./components";
import { TreeContext, TreeContextValue } from "./context";
import { Item } from "./types";

interface ProjectsTreeProps {
  className?: string;
  items: Item[];
  activeItem: Item | null;
}

const ProjectsTree: FC<ProjectsTreeProps> = (props) => {
  const { className, items, activeItem } = props;
  const contextValue = useMemo<TreeContextValue>(
    () => ({
      activeItemId: activeItem?.id,
    }),
    [activeItem],
  );

  return (
    <TreeContext.Provider value={contextValue}>
      <TreeRecursive className={className} items={items} />
    </TreeContext.Provider>
  );
};

export default ProjectsTree;
