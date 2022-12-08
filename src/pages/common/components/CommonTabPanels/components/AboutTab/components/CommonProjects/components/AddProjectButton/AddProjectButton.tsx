import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import { PlusIcon } from "@/shared/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui-kit";
import styles from "./AddProjectButton.module.scss";

interface AddProjectButtonProps {
  text?: string;
  tooltipContent?: ReactNode;
  onClick?: () => void;
  visuallyDisabled?: boolean;
}

const AddProjectButton: FC<AddProjectButtonProps> = (props) => {
  const {
    text = "Add new project",
    tooltipContent,
    onClick,
    visuallyDisabled,
  } = props;
  const buttonEl = (
    <button
      className={classNames(styles.item, {
        [styles.itemDisabled]: visuallyDisabled,
      })}
      aria-disabled={visuallyDisabled}
      onClick={visuallyDisabled ? undefined : onClick}
    >
      <div className={styles.iconWrapper}>
        <PlusIcon className={styles.icon} />
      </div>
      <span className={styles.text}>{text}</span>
    </button>
  );

  if (!tooltipContent) {
    return buttonEl;
  }

  return (
    <Tooltip placement="bottom-end">
      <TooltipTrigger asChild>{buttonEl}</TooltipTrigger>
      <TooltipContent className={styles.tooltipContent}>
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
};

export default AddProjectButton;
