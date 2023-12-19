import React, { FC, MouseEventHandler, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import { useRoutesContext } from "@/shared/contexts";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Link4Icon } from "@/shared/icons";
import {
  Loader,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui-kit";
import { LinkedItemTooltipContent } from "./components";
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
  const isTabletView = useIsTabletView();
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: commonPaths,
    loading,
    fetched,
    fetchCommonPaths,
  } = useCommonPaths();
  const { getCommonPagePath } = useRoutesContext();

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
    <Tooltip
      open={isOpen}
      onOpenChange={setIsOpen}
      placement={isTabletView ? "bottom-start" : "right"}
      shouldOpenOnHover={!isTabletView}
    >
      <TooltipTrigger onClick={toggleTooltip} asChild>
        <ButtonIcon>
          <Link4Icon className={styles.linkIcon} />
        </ButtonIcon>
      </TooltipTrigger>
      <TooltipContent className={styles.tooltipContent}>
        <span className={styles.contentTitle}>Also appears in:</span>
        {!fetched && <Loader className={styles.loader} />}
        {fetched &&
          commonPaths.map((commons, index) => {
            const lastCommon = commons[commons.length - 1];
            const key = lastCommon?.id || String(index);

            return (
              <NavLink
                key={key}
                className={classNames(styles.link, {
                  [styles.linkWithBottomMargin]:
                    index !== commonPaths.length - 1,
                })}
                to={getCommonPagePath(lastCommon?.id || "")}
                title={lastCommon?.name}
              >
                <LinkedItemTooltipContent commons={commons} />
              </NavLink>
            );
          })}
      </TooltipContent>
    </Tooltip>
  );
};

export default LinkedItemMark;
