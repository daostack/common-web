import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { useRoutesContext } from "@/shared/contexts";
import { RightArrowThinIcon, StarIcon } from "@/shared/icons";
import { CommonAvatar, TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import { getPluralEnding } from "@/shared/utils";
import styles from "./HeaderCommonContent.module.scss";

interface HeaderCommonContentProps {
  commonId: string;
  commonName: string;
  commonImage: string;
  isProject: boolean;
  memberCount: number;
  showFollowIcon?: boolean;
}

const HeaderCommonContent: FC<HeaderCommonContentProps> = (props) => {
  const {
    commonId,
    commonName,
    commonImage,
    isProject,
    memberCount,
    showFollowIcon = false,
  } = props;
  const { getCommonPageAboutTabPath } = useRoutesContext();

  return (
    <div className={styles.container}>
      <TopNavigationOpenSidenavButton
        className={styles.openSidenavButton}
        iconEl={<RightArrowThinIcon className={styles.openSidenavIcon} />}
      />
      <NavLink
        className={styles.commonLink}
        to={getCommonPageAboutTabPath(commonId)}
      >
        <CommonAvatar
          name={commonName}
          src={commonImage}
          className={classNames(styles.image, {
            [styles.imageNonRounded]: !isProject,
            [styles.imageRounded]: isProject,
          })}
        />

        <div className={styles.commonInfoWrapper}>
          <div className={styles.commonMainInfoWrapper}>
            <h1 className={styles.commonName}>{commonName}</h1>
            {showFollowIcon && <StarIcon stroke="currentColor" />}
          </div>
          <p className={styles.commonMembersAmount}>
            {memberCount} member{getPluralEnding(memberCount)}
          </p>
        </div>
      </NavLink>
    </div>
  );
};

export default HeaderCommonContent;
