import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { CommonAvatar } from "@/pages/common/components/CommonAvatar";
import { NewStreamButton } from "@/pages/common/components/CommonTabPanels/components/FeedTab/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { RightArrowThinIcon } from "@/shared/icons";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import { getCommonPageAboutTabPath, getPluralEnding } from "@/shared/utils";
import styles from "./HeaderContent.module.scss";

interface HeaderContentProps {
  className?: string;
  commonId: string;
  commonName: string;
  commonImage: string;
  commonMembersAmount: number;
  isProject?: boolean;
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Governance;
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const {
    className,
    commonId,
    commonName,
    commonImage,
    commonMembersAmount,
    isProject = false,
    commonMember,
    governance,
  } = props;

  const isMobileVersion = useIsTabletView();

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.commonContent}>
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
            <h1 className={styles.commonName}>{commonName}</h1>
            <p className={styles.commonMembersAmount}>
              {commonMembersAmount} member{getPluralEnding(commonMembersAmount)}
            </p>
          </div>
        </NavLink>
      </div>
      <NewStreamButton
        className={styles.newStreamButton}
        commonMember={commonMember}
        governance={governance}
        isMobileVersion={isMobileVersion}
      />
    </div>
  );
};

export default HeaderContent;
