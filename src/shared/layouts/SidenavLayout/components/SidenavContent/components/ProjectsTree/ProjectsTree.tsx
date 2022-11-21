import React, { FC, useMemo } from "react";
import { useLocation } from "react-router";
import { TreeRecursive } from "./components";
import { TreeContext, TreeContextValue } from "./context";
import { Item } from "./types";
import { getItemByPath } from "./utils";

interface ProjectsTreeProps {
  className?: string;
  items: Item[];
}

const ProjectsTree: FC<ProjectsTreeProps> = (props) => {
  const { className, items } = props;
  const location = useLocation();
  const activeItem = getItemByPath(location.pathname, items);
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
