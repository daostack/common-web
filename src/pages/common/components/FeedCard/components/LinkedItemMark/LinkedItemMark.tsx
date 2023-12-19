import React, { FC, MouseEventHandler, useEffect, useState } from "react";
import { ButtonIcon } from "@/shared/components";
import { Link4Icon } from "@/shared/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui-kit";
import { useCommonPaths } from "./hooks";
import styles from "./LinkedItemMark.module.scss";

interface LinkedItemMarkProps {
  currentCommonId?: string;
  originalCommonId?: string;
  linkedCommonIds?: string[];
}

const LinkedItemMark: FC<LinkedItemMarkProps> = (props) => {
  const {
    currentCommonId,
    originalCommonId = "",
    linkedCommonIds = [],
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: commonPaths,
    loading,
    fetched,
    fetchCommonPaths,
  } = useCommonPaths();

  const toggleTooltip: MouseEventHandler = (event) => {
    event.stopPropagation();
    setIsOpen((v) => !v);
  };

  useEffect(() => {
    if (!isOpen || loading || fetched) {
      return;
    }

    const commonIds = linkedCommonIds
      .concat(originalCommonId)
      .filter((commonId) => commonId && commonId !== currentCommonId);

    fetchCommonPaths(commonIds);
  }, [isOpen]);

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
