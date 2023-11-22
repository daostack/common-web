import React, { FC } from "react";
import classNames from "classnames";
import { SidebarIcon, StarIcon } from "@/shared/icons";
import { CommonAvatar, TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import { getPluralEnding } from "@/shared/utils";
import { ContentWrapper } from "./components";
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

  return (
    <div className={styles.container}>
      <TopNavigationOpenSidenavButton
        className={styles.openSidenavButton}
        iconEl={<SidebarIcon className={styles.openSidenavIcon} />}
      />
      <ContentWrapper className={styles.commonLink} commonId={commonId}>
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
      </ContentWrapper>
    </div>
  );
};

export default HeaderCommonContent;
