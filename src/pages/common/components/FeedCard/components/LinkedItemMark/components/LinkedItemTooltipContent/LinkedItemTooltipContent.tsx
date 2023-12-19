import React, { FC, ReactElement, useEffect, useState } from "react";
import { RightArrowThinIcon } from "@/shared/icons";
import { Common } from "@/shared/models";
import styles from "./LinkedItemTooltipContent.module.scss";

interface LinkedItemTooltipContentProps {
  commons: Common[];
}

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

const LinkedItemTooltipContent: FC<LinkedItemTooltipContentProps> = (props) => {
  const { commons } = props;
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [shouldCut, setShouldCut] = useState(false);

  useEffect(() => {
    if (containerRef && containerRef.scrollWidth > containerRef.clientWidth) {
      setShouldCut(true);
    }
  }, [containerRef]);

  if (shouldCut) {
    return renderCutPath(commons);
  }

  return (
    <div ref={setContainerRef} className={styles.linkLeft}>
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

export default LinkedItemTooltipContent;
