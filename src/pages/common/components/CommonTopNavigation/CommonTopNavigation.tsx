import React, { FC, ReactNode } from "react";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  TopNavigation,
  TopNavigationOpenSidenavButton,
} from "@/shared/ui-kit";
import { useCommonDataContext } from "../../providers";
import { CommonMemberInfo } from "../CommonMemberInfo";
import { CommonMenuButton } from "../CommonMenuButton";
import { PendingJoinInfo } from "../PendingJoinInfo";
import styles from "./CommonTopNavigation.module.scss";

interface CommonTopNavigationProps {
  commonMember: (CommonMember & CirclesPermissions) | null;
  circles: Governance["circles"];
  isSubCommon: boolean;
  commonId: string;
}

const CommonTopNavigation: FC<CommonTopNavigationProps> = (props) => {
  const { commonMember, circles, isSubCommon, commonId } = props;
  const { isJoinAllowed, isJoinPending, onJoinCommon } = useCommonDataContext();
  const isJoinButtonVisible = !isSubCommon && isJoinAllowed;

  const renderCentralElement = (): ReactNode => {
    if (commonMember) {
      return (
        <CommonMemberInfo
          circles={circles}
          commonId={commonId}
          commonMember={commonMember}
          isMobileVersion
        />
      );
    }

    return isJoinPending ? <PendingJoinInfo isMobileVersion /> : null;
  };

  const renderRightElement = (): ReactNode => {
    if (commonMember) {
      return (
        <CommonMenuButton
          commonMember={commonMember}
          circles={circles}
          isSubCommon={isSubCommon}
          isMobileVersion
        />
      );
    }
    if (isJoinButtonVisible) {
      return (
        <Button
          variant={ButtonVariant.OutlineBlue}
          size={ButtonSize.Xsmall}
          onClick={onJoinCommon}
        >
          Join
        </Button>
      );
    }

    return <div className={styles.emptyBlock} />;
  };

  return (
    <TopNavigation className={styles.container}>
      <TopNavigationOpenSidenavButton />
      {renderCentralElement()}
      {renderRightElement()}
    </TopNavigation>
  );
};

export default CommonTopNavigation;
