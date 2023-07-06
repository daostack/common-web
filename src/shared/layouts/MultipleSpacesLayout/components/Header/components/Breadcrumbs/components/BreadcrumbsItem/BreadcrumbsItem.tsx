import React, { FC, useRef } from "react";
import { ContextMenuRef } from "@/shared/ui-kit";
import { ProjectsStateItem } from "@/store/states";
import { BreadcrumbsMenu } from "../BreadcrumbsMenu";
import styles from "./BreadcrumbsItem.module.scss";

interface BreadcrumbsItemProps {
  activeItemId: string;
  items: ProjectsStateItem[];
  commonIdToAddProject?: string | null;
  onCommonCreate?: () => void;
}

const BreadcrumbsItem: FC<BreadcrumbsItemProps> = (props) => {
  const { activeItemId, items, commonIdToAddProject, onCommonCreate } = props;
  const containerRef = useRef<HTMLLIElement>(null);
  const contextMenuRef = useRef<ContextMenuRef>(null);
  const activeItem = items.find((item) => item.commonId === activeItemId);

  if (!activeItem) {
    return null;
  }

  const handleButtonClick = () => {
    if (containerRef.current) {
      const { x, y, height } = containerRef.current.getBoundingClientRect();
      contextMenuRef.current?.open(x, y + height);
    }
  };

  return (
    <li ref={containerRef}>
      <button className={styles.button} onClick={handleButtonClick}>
        {activeItem.name}
      </button>
      <BreadcrumbsMenu
        ref={contextMenuRef}
        items={items}
        activeItemId={activeItemId}
        commonIdToAddProject={commonIdToAddProject}
        onCommonCreate={onCommonCreate}
      />
    </li>
  );
};

export default BreadcrumbsItem;
