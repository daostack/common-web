import React, { FC } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useJoinProjectAutomatically } from "@/pages/common/hooks";
import { useCommonDataContext } from "@/pages/common/providers";
import { useRoutesContext } from "@/shared/contexts";
import { Common } from "@/shared/models";
import { Button, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import styles from "./CommonEntranceJoin.module.scss";

interface CommonEntranceJoinProps {
  withJoinRequest?: boolean;
  common: Common;
  isProject: boolean;
}

const CommonEntranceJoin: FC<CommonEntranceJoinProps> = (props) => {
  const { common, isProject } = props;
  const history = useHistory();
  const {
    parentCommon,
    parentCommonMember,
    commonMember,
    rootCommon,
    rootCommonMember,
    isJoinAllowed,
    onJoinCommon,
  } = useCommonDataContext();
  const { getCommonPagePath, getCommonPageAboutTabPath } = useRoutesContext();
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
          <strong>
            <NavLink to={getCommonPagePath(parentCommon.id)}>
              {parentCommon.name}
            </NavLink>
          </strong>{" "}
          common. Only common members can join the space.
        </p>
      )}
      {!commonMember && rootCommon && !rootCommonMember && (
        <Button
          className={styles.joinButton}
          variant={ButtonVariant.OutlineDarkPink}
          onClick={() => history.push(getCommonPageAboutTabPath(rootCommon.id))}
        >
          Join via {rootCommon.name} page
        </Button>
      )}
      {!commonMember &&
        rootCommonMember &&
        parentCommon &&
        !parentCommonMember && (
          <p className={styles.joinHint}>
            Join via{" "}
            <NavLink to={getCommonPageAboutTabPath(parentCommon.id)}>
              {parentCommon.name}
            </NavLink>{" "}
            page
          </p>
        )}
      {!isProject && (isJoinAllowed || isJoinPending) && (
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
          Join
        </Button>
      )}
    </>
  );
};

export default CommonEntranceJoin;
