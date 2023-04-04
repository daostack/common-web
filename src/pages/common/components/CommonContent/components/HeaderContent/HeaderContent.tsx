import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { LongLeftArrowIcon } from "@/shared/icons";
import { TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import { getCommonPagePath } from "@/shared/utils";
import styles from "./HeaderContent.module.scss";

interface HeaderContentProps {
  className?: string;
  commonId: string;
  withoutBackButton?: boolean;
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const { className, commonId, withoutBackButton = false } = props;

  return (
    <div className={classNames(styles.container, className)}>
      {!withoutBackButton && (
        <NavLink className={styles.link} to={getCommonPagePath(commonId)}>
          <TopNavigationOpenSidenavButton
            iconEl={<LongLeftArrowIcon className={styles.backIcon} />}
          />
          Back to feed
        </NavLink>
      )}
    </div>
  );
};

export default HeaderContent;
