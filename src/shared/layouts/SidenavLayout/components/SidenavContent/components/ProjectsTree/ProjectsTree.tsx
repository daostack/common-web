import React, { FC } from "react";
import { TreeRecursive } from "./components";
import { Item } from "./types";

interface ProjectsTreeProps {
  items: Item[];
}

const ProjectsTree: FC<ProjectsTreeProps> = (props) => {
  const { items } = props;

  return <TreeRecursive items={items} />;
};

export default ProjectsTree;
