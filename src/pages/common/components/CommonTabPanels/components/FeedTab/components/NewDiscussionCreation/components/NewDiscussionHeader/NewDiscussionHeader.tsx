import React, { FC } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { UserAvatar } from "@/shared/components";
import { Governance } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import { PermissionSelection } from "../PermissionSelection";
import styles from "./NewDiscussionHeader.module.scss";

interface NewDiscussionHeaderProps {
  governanceCircles: Governance["circles"];
  userCircleIds?: string[];
}

const NewDiscussionHeader: FC<NewDiscussionHeaderProps> = (props) => {
  const { governanceCircles, userCircleIds } = props;
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
          governanceCircles={governanceCircles}
          userCircleIds={userCircleIds}
        />
      </div>
    </div>
  );
};

export default NewDiscussionHeader;
