import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonDataContext } from "@/pages/common/providers";
import { CommonService } from "@/services";
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
  const [isParentCommonMember, setIsParentCommonMember] = useState(false);
  const { parentCommon } = useCommonDataContext();
  const user = useSelector(selectUser());
  const parentId = common.directParent?.commonId;
  const userId = user?.uid;

  useEffect(() => {
    if (!parentId || !userId) {
      return;
    }

    (async () => {
      const commonMember = await CommonService.getCommonMemberByUserId(
        parentId,
        userId,
      );
      setIsParentCommonMember(Boolean(commonMember));
    })();
  }, [userId, parentId]);

  return (
    <>
      {isProject && parentCommon?.name && (
        <p className={styles.joinHint}>
          <strong>{common.name}</strong> is a project in the{" "}
          <strong>{parentCommon.name}</strong> common. Only common members can
          join the project.
        </p>
      )}
      {withJoinRequest && (!isProject || isParentCommonMember) && (
        <Button
          className={styles.joinButton}
          variant={ButtonVariant.OutlineBlue}
          size={ButtonSize.Medium}
        >
          Join the {isProject ? "project" : "effort"}
        </Button>
      )}
    </>
  );
};

export default CommonEntranceJoin;
