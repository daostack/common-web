import React, { FC } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import { RightArrowThinIcon } from "@/shared/icons";
import styles from "./Header.module.scss";

interface HeaderProps {
  className?: string;
  title: string;
  titleActionElement?: React.ReactElement | null;
  onBackClick?: () => void;
}

const Header: FC<HeaderProps> = (props) => {
  const { className, title, onBackClick, titleActionElement } = props;

  return (
    <div className={classNames(styles.container, className)}>
      <ButtonIcon onClick={onBackClick}>
        <RightArrowThinIcon className={styles.openSidenavIcon} />
      </ButtonIcon>
      <p className={styles.title}>
        {title} {titleActionElement}
      </p>
    </div>
  );
};

export default Header;
