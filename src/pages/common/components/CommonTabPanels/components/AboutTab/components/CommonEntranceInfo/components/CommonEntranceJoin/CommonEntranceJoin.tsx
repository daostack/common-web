import React, { FC } from "react";
import { useCommonDataContext } from "@/pages/common/providers";
import { Common } from "@/shared/models";
import { Button, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import styles from "./CommonEntranceJoin.module.scss";

interface CommonEntranceJoinProps {
  withJoinRequest?: boolean;
  common: Common;
  isProject: boolean;
}

const CommonEntranceJoin: FC<CommonEntranceJoinProps> = (props) => {
  const { withJoinRequest = false, common, isProject } = props;
  const { parentCommon, isJoinAllowed, onJoinCommon } = useCommonDataContext();

  return (
    <>
      {isProject && parentCommon?.name && (
        <p className={styles.joinHint}>
          <strong>{common.name}</strong> is a project in the{" "}
          <strong>{parentCommon.name}</strong> common. Only common members can
          join the project.
        </p>
      )}
      {withJoinRequest && !isProject && isJoinAllowed && (
        <Button
          className={styles.joinButton}
          variant={ButtonVariant.OutlineBlue}
          size={ButtonSize.Medium}
          onClick={onJoinCommon}
        >
          Join the {isProject ? "project" : "effort"}
        </Button>
      )}
    </>
  );
};

export default CommonEntranceJoin;
