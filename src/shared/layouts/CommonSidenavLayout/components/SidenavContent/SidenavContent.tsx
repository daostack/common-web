import React, { FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { authentificated, selectUser } from "@/pages/Auth/store/selectors";
import commonLogoSrc from "@/shared/assets/images/logo-sidenav-2.svg";
import { CommonLogo, Footer, FooterVariant } from "@/shared/ui-kit";
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
      <CommonLogo
        className={styles.commonLogoContainer}
        logoClassName={styles.commonLogo}
        logoSrc={commonLogoSrc}
      />
      {separatorEl}
      <Projects />
      <div className={styles.userInfoSeparator} />
      <UserInfo
        avatarURL={user?.photoURL}
        userName={getUserName(user)}
        isAuthenticated={isAuthenticated}
      />
      <Footer variant={FooterVariant.Small} />
    </div>
  );
};

export default SidenavContent;
