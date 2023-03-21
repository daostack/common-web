import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { Image } from "@/shared/components";
import { RightArrowThinIcon } from "@/shared/icons";
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
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const {
    className,
    commonId,
    commonName,
    commonImage,
    commonMembersAmount,
    isProject = false,
  } = props;

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.commonContent}>
        <TopNavigationOpenSidenavButton
          className={styles.openSidenavButton}
          iconEl={<RightArrowThinIcon className={styles.openSidenavIcon} />}
        />
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
          <h1 className={styles.commonName}>
            <NavLink
              className={styles.commonLink}
              to={getCommonPageAboutTabPath(commonId)}
            >
              {commonName}
            </NavLink>
          </h1>
          <p className={styles.commonMembersAmount}>
            {commonMembersAmount} member{commonMembersAmount === 1 ? "" : "s"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderContent;
