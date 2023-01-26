import React, { FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { authentificated, selectUser } from "@/pages/Auth/store/selectors";
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
      <CommonLogo />
      {separatorEl}
      <UserInfo
        avatarURL={user?.photoURL}
        userName={getUserName(user)}
        isAuthenticated={isAuthenticated}
      />
      {separatorEl}
      {/* Temporary: see https://github.com/daostack/common-web/issues/1110 */}
      {/* <Navigation />
      {separatorEl} */}
      <Projects />
      <Footer className={styles.footer} variant={FooterVariant.Small} />
    </div>
  );
};

export default SidenavContent;
