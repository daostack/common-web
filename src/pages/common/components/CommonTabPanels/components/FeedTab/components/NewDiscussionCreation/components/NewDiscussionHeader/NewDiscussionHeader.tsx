import React, { FC } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { UserAvatar } from "@/shared/components";
import { Circle, Governance } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import { PermissionSelection } from "../PermissionSelection";
import styles from "./NewDiscussionHeader.module.scss";

interface NewDiscussionHeaderProps {
  currentCircle: Circle | null;
  governanceCircles: Governance["circles"];
  userCircleIds?: string[];
  onCircleSave: (circle: Circle | null) => void;
  disabled?: boolean;
}

const NewDiscussionHeader: FC<NewDiscussionHeaderProps> = (props) => {
  const {
    currentCircle,
    governanceCircles,
    userCircleIds,
    onCircleSave,
    disabled = false,
  } = props;
  const user = useSelector(selectUser());
  const userName = getUserName(user);

  return (
    <div className={styles.container}>
      <UserAvatar
        className={styles.avatar}
        photoURL={user?.photoURL}
        userName={userName}
        preloaderSrc={avatarPlaceholderSrc}
      />
      <div className={styles.content}>
        <span className={styles.userName}>{userName}</span>
        <PermissionSelection
          currentCircle={currentCircle}
          governanceCircles={governanceCircles}
          userCircleIds={userCircleIds}
          onCircleSave={onCircleSave}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default NewDiscussionHeader;
