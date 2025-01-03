import React, { FC, ReactNode } from "react";
import { useHistory } from "react-router-dom";
import { useRoutesContext } from "@/shared/contexts";
import { useGoBack } from "@/shared/hooks";
import { LongLeftArrowIcon } from "@/shared/icons";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  TopNavigation,
  TopNavigationBackButton,
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
  const history = useHistory();
  const { canGoBack, goBack } = useGoBack();
  const { getCommonPagePath } = useRoutesContext();
  const { isJoinAllowed, isJoinPending, onJoinCommon } = useCommonDataContext();
  const circlesMap = commonMember?.circles.map;

  const handleBackButtonClick = () => {
    if (canGoBack) {
      goBack();
    } else if (commonMember) {
      history.push(getCommonPagePath(commonId));
    }
  };

  const renderCentralElement = (): ReactNode => {
    if (commonMember) {
      return (
        <CommonMemberInfo
          circlesMap={circlesMap}
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
    if (isJoinAllowed) {
      return (
        <Button
          variant={ButtonVariant.OutlineDarkPink}
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
      {canGoBack || commonMember ? (
        <TopNavigationBackButton
          className={styles.backIconButton}
          iconEl={<LongLeftArrowIcon className={styles.backIcon} />}
          onClick={handleBackButtonClick}
        />
      ) : (
        <div className={styles.emptyBlock} />
      )}
      {renderCentralElement()}
      {renderRightElement()}
    </TopNavigation>
  );
};

export default CommonTopNavigation;
