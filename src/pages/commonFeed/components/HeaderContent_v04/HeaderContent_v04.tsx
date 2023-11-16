import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { NewStreamButton } from "@/pages/common/components/CommonTabPanels/components/FeedTab/components";
import { useRoutesContext } from "@/shared/contexts";
import { useCommonFollow } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { SidebarIcon, StarIcon } from "@/shared/icons";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { CommonAvatar, TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import { checkIsProject, getPluralEnding } from "@/shared/utils";
import { ActionsButton } from "../HeaderContent/components";
import styles from "./HeaderContent_v04.module.scss";

interface HeaderContentProps {
  className?: string;
  common: Common;
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Governance;
}

const HeaderContent_v04: FC<HeaderContentProps> = (props) => {
  const { className, common, commonMember, governance } = props;
  const { getCommonPageAboutTabPath } = useRoutesContext();
  const isMobileVersion = useIsTabletView();
  const isProject = checkIsProject(common);
  const commonFollow = useCommonFollow(common.id, commonMember);
  const showFollowIcon = commonFollow.isFollowInProgress
    ? !commonMember?.isFollowing
    : commonMember?.isFollowing;

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.commonContent}>
        <TopNavigationOpenSidenavButton
          className={styles.openSidenavButton}
          iconEl={<SidebarIcon className={styles.openSidenavIcon} />}
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
              {common.memberCount} member{getPluralEnding(common.memberCount)}
            </p>
          </div>
        </NavLink>
      </div>
      <div className={styles.actionsContainer}>
        <NewStreamButton
          className={styles.newStreamButton}
          commonMember={commonMember}
          governance={governance}
          isMobileVersion={isMobileVersion}
        />
        <ActionsButton
          common={common}
          commonMember={commonMember}
          commonFollow={commonFollow}
        />
      </div>
    </div>
  );
};

export default HeaderContent_v04;
