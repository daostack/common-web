import React, { FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { UserAvatar } from "@/shared/components";
import { getUserName } from "@/shared/utils";
import styles from "./NewProposalHeader.module.scss";

interface NewProposalHeaderProps {
  className?: string;
  proposalType?: string;
}

const NewProposalHeader: FC<NewProposalHeaderProps> = (props) => {
  const { className, proposalType } = props;
  const user = useSelector(selectUser());
  const userName = getUserName(user);

  return (
    <div className={classNames(styles.container, className)}>
      <UserAvatar
        className={styles.avatar}
        photoURL={user?.photoURL}
        userName={userName}
        preloaderSrc={avatarPlaceholderSrc}
      />
      <div className={styles.content}>
        <div className={styles.contentTextRow}>
          <span className={styles.text}>{userName}</span>
          <span className={styles.text}>{proposalType}</span>
        </div>
        <span className={styles.text}>Public</span>
      </div>
    </div>
  );
};

export default NewProposalHeader;
