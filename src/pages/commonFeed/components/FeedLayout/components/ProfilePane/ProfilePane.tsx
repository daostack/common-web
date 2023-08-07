import React, { FC } from "react";
import classNames from "classnames";
import { DesktopRightPane } from "../DesktopRightPane";
import { ProfileContent } from "../ProfileContent";
import styles from "./ProfilePane.module.scss";

interface ProfilePaneProps {
  className?: string;
  userId: string;
  commonId?: string;
}

const ProfilePane: FC<ProfilePaneProps> = (props) => {
  const { className, userId, commonId } = props;

  return (
    <DesktopRightPane className={classNames(styles.container, className)}>
      <ProfileContent
        className={styles.content}
        userId={userId}
        commonId={commonId}
      />
    </DesktopRightPane>
  );
};

export default ProfilePane;
