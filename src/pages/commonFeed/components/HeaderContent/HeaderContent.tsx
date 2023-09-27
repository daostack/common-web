import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { useRoutesContext } from "@/shared/contexts";
import { useCommonFollow } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { RightArrowThinIcon, StarIcon } from "@/shared/icons";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { CommonAvatar, TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import { checkIsProject, getPluralEnding } from "@/shared/utils";
import { ActionsButton, NewStreamButton } from "./components";
import styles from "./HeaderContent.module.scss";

interface HeaderContentProps {
  className?: string;
  common: Common;
  commonMembersAmount: number;
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Governance;
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const { className, common, commonMembersAmount, commonMember, governance } =
    props;
  const { getCommonPageAboutTabPath } = useRoutesContext();
  const isMobileVersion = useIsTabletView();
  const commonFollow = useCommonFollow(common.id, commonMember);
  const isProject = checkIsProject(common);
  const showFollowIcon = commonFollow.isFollowInProgress
    ? !commonMember?.isFollowing
    : commonMember?.isFollowing;

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.commonContent}>
        <TopNavigationOpenSidenavButton
          className={styles.openSidenavButton}
          iconEl={<RightArrowThinIcon className={styles.openSidenavIcon} />}
        />
        <NavLink
          className={styles.commonLink}
          to={getCommonPageAboutTabPath(common.id)}
        >
          <CommonAvatar
            name={common.name}
            src={common.image}
            className={classNames(styles.image, {
              [styles.imageNonRounded]: !isProject,
              [styles.imageRounded]: isProject,
            })}
          />

          <div className={styles.commonInfoWrapper}>
            <div className={styles.commonMainInfoWrapper}>
              <h1 className={styles.commonName}>{common.name}</h1>
              {showFollowIcon && <StarIcon stroke="currentColor" />}
            </div>
            <p className={styles.commonMembersAmount}>
              {commonMembersAmount} member{getPluralEnding(commonMembersAmount)}
            </p>
          </div>
        </NavLink>
      </div>
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
    </div>
  );
};

export default HeaderContent;
