import React, { FC } from "react";
import { useJoinProjectAutomatically } from "@/pages/common/hooks";
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
  const { parentCommon, commonMember, isJoinAllowed, onJoinCommon } =
    useCommonDataContext();
  const {
    canJoinProjectAutomatically,
    isJoinPending,
    onJoinProjectAutomatically,
  } = useJoinProjectAutomatically(commonMember, common, parentCommon, {
    shouldRedirectToFeed: true,
  });

  return (
    <>
      {isProject && parentCommon?.name && (
        <p className={styles.joinHint}>
          <strong>{common.name}</strong> is a space in the{" "}
          <strong>{parentCommon.name}</strong> common. Only common members can
          join the space.
        </p>
      )}
      {withJoinRequest && (isJoinAllowed || isJoinPending) && (
        <Button
          className={styles.joinButton}
          variant={ButtonVariant.OutlineDarkPink}
          size={ButtonSize.Medium}
          loading={isJoinPending}
          onClick={
            canJoinProjectAutomatically
              ? onJoinProjectAutomatically
              : onJoinCommon
          }
        >
          Join the {isProject ? "space" : "effort"}
        </Button>
      )}
    </>
  );
};

export default CommonEntranceJoin;
