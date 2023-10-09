import React, { FC } from "react";
import classNames from "classnames";
import styles from "./Header.module.scss";

interface HeaderProps {
  className?: string;
}

const Header: FC<HeaderProps> = (props) => {
  const { className } = props;

  return (
    <header className={classNames(styles.container, className)}>
      <h1 className={styles.title}>Settings</h1>
    </header>
  );
};

export default Header;
