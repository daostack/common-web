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
  isProject?: boolean;
}

const CommonEntranceJoin: FC<CommonEntranceJoinProps> = (props) => {
  const { withJoinRequest = false, common } = props;
  const user = useSelector(selectUser());
  const [isParentCommonMember, setIsParentCommonMember] = useState(false);
  const isProject = Boolean(common.directParent);
  const parentId = common.directParent?.commonId;
  const { parentCommon } = useCommonDataContext();

  useEffect(() => {
    if (!parentId || !user?.uid) {
      return;
    }

    (async () => {
      const commonMember = await CommonService.getCommonMemberByUserId(
        parentId,
        user.uid as string,
      );
      setIsParentCommonMember(Boolean(commonMember));
    })();
  }, [user, parentId]);

  return (
    <>
      {isProject && parentCommon?.name && (
        <p className={styles.joinHint}>
          <strong>{common.name}</strong> is a project in the{" "}
          <strong>{parentCommon.name}</strong> common. Only common members can
          join the project.
        </p>
      )}
      {((withJoinRequest && !isProject) ||
        (withJoinRequest && isParentCommonMember)) && (
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
