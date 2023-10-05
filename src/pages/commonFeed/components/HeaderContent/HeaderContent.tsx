import React, { FC } from "react";
import { useCommonFollow } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { checkIsProject } from "@/shared/utils";
import {
  ActionsButton,
  HeaderCommonContent,
  HeaderContentWrapper,
  NewStreamButton,
} from "./components";
import styles from "./HeaderContent.module.scss";

interface HeaderContentProps {
  className?: string;
  common: Common;
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Governance;
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const { className, common, commonMember, governance } = props;
  const isMobileVersion = useIsTabletView();
  const commonFollow = useCommonFollow(common.id, commonMember);
  const showFollowIcon = commonFollow.isFollowInProgress
    ? !commonMember?.isFollowing
    : commonMember?.isFollowing;

  return (
    <HeaderContentWrapper className={className}>
      <HeaderCommonContent
        commonId={common.id}
        commonName={common.name}
        commonImage={common.image}
        isProject={checkIsProject(common)}
        memberCount={common.memberCount}
        showFollowIcon={showFollowIcon}
      />
      <div className={styles.actionButtonsWrapper}>
        <NewStreamButton
          commonId={common.id}
          commonMember={commonMember}
          governance={governance}
          isMobileVersion={isMobileVersion}
        />
        <ActionsButton
          common={common}
          commonMember={commonMember}
          commonFollow={commonFollow}
          isMobileVersion={isMobileVersion}
        />
      </div>
    </HeaderContentWrapper>
  );
};

export default HeaderContent;
