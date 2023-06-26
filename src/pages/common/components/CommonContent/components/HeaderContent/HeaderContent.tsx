import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { LongLeftArrowIcon } from "@/shared/icons";
import { TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import styles from "./HeaderContent.module.scss";

interface HeaderContentProps {
  className?: string;
  backButtonPath: string;
  withoutBackButton?: boolean;
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const { className, backButtonPath, withoutBackButton = false } = props;

  return (
    <div className={classNames(styles.container, className)}>
      {!withoutBackButton && (
        <NavLink className={styles.link} to={backButtonPath}>
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
