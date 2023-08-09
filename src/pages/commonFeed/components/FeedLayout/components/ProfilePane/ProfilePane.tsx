import React, { FC } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import { Close2Icon } from "@/shared/icons";
import { DesktopRightPane } from "../DesktopRightPane";
import { ProfileContent } from "../ProfileContent";
import styles from "./ProfilePane.module.scss";

interface ProfilePaneProps {
  className?: string;
  userId: string;
  commonId?: string;
  onClose: () => void;
}

const ProfilePane: FC<ProfilePaneProps> = (props) => {
  const { className, userId, commonId, onClose } = props;

  return (
    <DesktopRightPane className={classNames(styles.container, className)}>
      <ButtonIcon className={styles.closeButton} onClick={onClose}>
        <Close2Icon />
      </ButtonIcon>
      <div className={styles.contentWrapper}>
        <ProfileContent
          className={styles.content}
          userId={userId}
          commonId={commonId}
        />
      </div>
    </DesktopRightPane>
  );
};

export default ProfilePane;
