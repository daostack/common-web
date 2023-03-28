import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { NewStreamButton } from "@/pages/common/components/CommonTabPanels/components/FeedTab/components";
import { Image } from "@/shared/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { RightArrowThinIcon } from "@/shared/icons";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import { getCommonPageAboutTabPath } from "@/shared/utils";
import styles from "./HeaderContent.module.scss";

interface HeaderContentProps {
  className?: string;
  commonId: string;
  commonName: string;
  commonImage: string;
  commonMembersAmount: number;
  isProject?: boolean;
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Pick<Governance, "circles">;
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
          <Image
            className={classNames(styles.image, {
              [styles.imageNonRounded]: !isProject,
              [styles.imageRounded]: isProject,
            })}
            src={commonImage}
            alt={`${commonName}'s image`}
            placeholderElement={null}
            aria-hidden
          />
          <div className={styles.commonInfoWrapper}>
            <h1 className={styles.commonName}>{commonName}</h1>
            <p className={styles.commonMembersAmount}>
              {commonMembersAmount} member{commonMembersAmount === 1 ? "" : "s"}
            </p>
          </div>
          <NewStreamButton
            commonMember={commonMember}
            governance={governance}
            isMobileVersion={isMobileVersion}
          />
        </NavLink>
      </div>
    </div>
  );
};

export default HeaderContent;
