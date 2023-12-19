import React, {
  FC,
  MouseEventHandler,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { NavLink } from "react-router-dom";
import { ButtonIcon } from "@/shared/components";
import { useRoutesContext } from "@/shared/contexts";
import { RightArrowThinIcon, Link4Icon } from "@/shared/icons";
import { Common } from "@/shared/models";
import {
  Loader,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui-kit";
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

  const renderFullPath = (commons: Common[]): ReactElement => {
    return (
      <div className={styles.linkLeft}>
        {commons.map((common, commonIndex) => (
          <React.Fragment key={common.id}>
            {common.name}
            {commonIndex !== commons.length - 1 && (
              <RightArrowThinIcon className={styles.arrowIcon} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderCutPath = (commons: Common[]): ReactElement => {
    const lastCommon = commons[commons.length - 1];
    const parentCommons = commons.slice(0, -1);

    return (
      <>
        <div className={styles.linkLeft}>
          {parentCommons.map((common, commonIndex) => (
            <React.Fragment key={common.id}>
              {common.name}
              {commonIndex !== commons.length - 1 && (
                <RightArrowThinIcon className={styles.arrowIcon} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className={styles.ellipsis}>…</div>
        <div className={styles.linkRight}>{lastCommon?.name}</div>
      </>
    );
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
        {loading && <Loader className={styles.loader} />}
        {!loading &&
          commonPaths.map((commons, index) => {
            const lastCommon = commons[commons.length - 1];
            const key = lastCommon?.id || String(index);

            return (
              <NavLink
                key={key}
                className={styles.link}
                to={getCommonPagePath(lastCommon?.id || "")}
                title={lastCommon?.name}
              >
                {renderCutPath(commons)}
              </NavLink>
            );
          })}
      </TooltipContent>
    </Tooltip>
  );
};

export default LinkedItemMark;
