import React, { FC, useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { ScreenSize } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { getScreenSize } from "@/shared/store/selectors";
import { ContextMenuRef } from "@/shared/ui-kit";
import { ProjectsStateItem } from "@/store/states";
import { truncateBreadcrumbName } from "../../utils";
import { BreadcrumbsMenu } from "../BreadcrumbsMenu";
import styles from "./BreadcrumbsItem.module.scss";

export interface BreadcrumbsItemProps {
  activeItem: ProjectsStateItem;
  items: ProjectsStateItem[];
  commonIdToAddProject?: string | null;
  onCommonCreate?: () => void;
  withMenu?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}

const BreadcrumbsItem: FC<BreadcrumbsItemProps> = (props) => {
  const {
    activeItem,
    items,
    commonIdToAddProject,
    onCommonCreate,
    withMenu = true,
    isLoading = false,
    onClick,
  } = props;
  const history = useHistory();
  const { getCommonPagePath } = useRoutesContext();
  const containerRef = useRef<HTMLLIElement>(null);
  const contextMenuRef = useRef<ContextMenuRef>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleButtonClick = () => {
    if (!withMenu) {
      history.push(getCommonPagePath(activeItem.commonId));
      onClick?.();
      return;
    }
    if (containerRef.current) {
      const { x, y, height } = containerRef.current.getBoundingClientRect();
      contextMenuRef.current?.open(x, y + height);
    }
  };

  return (
    <li ref={containerRef}>
      <button className={styles.button} onClick={handleButtonClick}>
        {isMobileView
          ? truncateBreadcrumbName(activeItem.name)
          : activeItem.name}
      </button>
      {withMenu && (
        <BreadcrumbsMenu
          ref={contextMenuRef}
          items={items}
          activeItemId={activeItem.commonId}
          commonIdToAddProject={commonIdToAddProject}
          isLoading={isLoading}
          onCommonCreate={onCommonCreate}
        />
      )}
    </li>
  );
};

export default BreadcrumbsItem;
