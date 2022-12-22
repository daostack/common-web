import React, { FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { authentificated, selectUser } from "@/pages/Auth/store/selectors";
import { CommonLogo } from "@/shared/ui-kit";
import { getUserName } from "@/shared/utils";
import { Navigation, Projects, UserInfo } from "./components";
import styles from "./SidenavContent.module.scss";

interface SidenavContentProps {
  className?: string;
}

const SidenavContent: FC<SidenavContentProps> = (props) => {
  const { className } = props;
  const isAuthenticated = useSelector(authentificated());
  const user = useSelector(selectUser());
  const separatorEl = <div className={styles.separator} />;

  return (
    <div className={classNames(styles.container, className)}>
      <CommonLogo />
      {separatorEl}
      <UserInfo
        avatarURL={user?.photoURL}
        userName={getUserName(user)}
        isAuthenticated={isAuthenticated}
      />
      {separatorEl}
      <Navigation />
      {separatorEl}
      <Projects />
    </div>
  );
};

export default SidenavContent;
