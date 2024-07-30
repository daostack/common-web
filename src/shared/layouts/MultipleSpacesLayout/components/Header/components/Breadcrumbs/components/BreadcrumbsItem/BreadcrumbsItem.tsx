import React, { FC, useRef, useMemo } from "react";
import { useHistory } from "react-router";
import { useMeasure } from "react-use";
import { useRoutesContext } from "@/shared/contexts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  ContextMenuRef,
} from "@/shared/ui-kit";
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
  truncate?: boolean;
  onClick?: () => void;
}

const PADDING = 24;
const OVERLAY_THRESHOLD = 5;

const BreadcrumbsItem: FC<BreadcrumbsItemProps> = (props) => {
  const {
    activeItem,
    items,
    commonIdToAddProject,
    onCommonCreate,
    withMenu = true,
    isLoading = false,
    truncate = false,
    onClick,
  } = props;
  const history = useHistory();
  const [containerRef, { width: containerWidth }] = useMeasure<HTMLLIElement>();
  const [buttonRef, { width: buttonWidth }] = useMeasure<HTMLButtonElement>();

  const hasOverlay = useMemo(() => {
    return (
      Math.abs(
        Math.floor(containerWidth) - Math.floor(buttonWidth + PADDING),
      ) >= OVERLAY_THRESHOLD
    );
  }, [containerWidth, buttonWidth]);

  const { getCommonPagePath } = useRoutesContext();
  const contextMenuRef = useRef<ContextMenuRef>(null);

  const handleButtonClick = () => {
    if (!withMenu) {
      history.push(getCommonPagePath(activeItem.commonId));
      onClick?.();
      return;
    }
  };

  return (
    <li ref={containerRef} className={styles.li}>
      <Tooltip placement="bottom-start">
        <TooltipTrigger asChild>
          <button
            ref={buttonRef}
            className={styles.button}
            onClick={handleButtonClick}
          >
            {truncate
              ? truncateBreadcrumbName(activeItem.name)
              : activeItem.name}
          </button>
        </TooltipTrigger>
        <TooltipContent withOverlay={hasOverlay}>
          <span className={styles.tooltipContent}>{activeItem.name}</span>
        </TooltipContent>
      </Tooltip>
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
