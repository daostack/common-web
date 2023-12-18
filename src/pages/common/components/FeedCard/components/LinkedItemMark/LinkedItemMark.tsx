import React, { FC, MouseEventHandler, useState } from "react";
import { ButtonIcon } from "@/shared/components";
import { Link4Icon } from "@/shared/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui-kit";
import styles from "./LinkedItemMark.module.scss";

interface LinkedItemMarkProps {
  a?: boolean;
}

const LinkedItemMark: FC<LinkedItemMarkProps> = (props) => {
  const { a } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggleTooltip: MouseEventHandler = (event) => {
    event.stopPropagation();
    setIsOpen((v) => !v);
  };

  return (
    <Tooltip open={isOpen} onOpenChange={setIsOpen} placement="right">
      <TooltipTrigger onClick={toggleTooltip} asChild>
        <ButtonIcon>
          <Link4Icon className={styles.linkIcon} />
        </ButtonIcon>
      </TooltipTrigger>
      <TooltipContent className={styles.tooltipContent}>
        <span className={styles.contentTitle}>Also appears in:</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default LinkedItemMark;
