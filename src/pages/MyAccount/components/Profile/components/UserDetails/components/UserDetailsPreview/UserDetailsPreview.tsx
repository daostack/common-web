import React, { FC } from "react";
import classNames from "classnames";
import { countryList } from "@/shared/assets/countries";
import { DateFormat, User } from "@/shared/models";
import { formatDate, getUserName } from "@/shared/utils";
import styles from "./UserDetailsPreview.module.scss";

interface UserDetailsPreviewProps {
  className?: string;
  user: User;
  isMobileView?: boolean;
}

const UserDetailsPreview: FC<UserDetailsPreviewProps> = (props) => {
  const { className, user, isMobileView = false } = props;
  const country = countryList.find((item) => item.value === user.country);
  const countryName =
    country && country.name.slice(0, country.name.lastIndexOf(" "));

  return (
    <div className={classNames(styles.container, className)}>
      <p className={styles.name}>{getUserName(user)}</p>
      {user.email && <p className={styles.info}>{user.email}</p>}
      {!isMobileView && (
        <>
          <p className={styles.info}>
            Join at{" "}
            {formatDate(
              new Date(user.createdAt.seconds * 1000),
              DateFormat.SuperShortSecondary,
            )}
          </p>
          {countryName && <p className={styles.info}>{countryName}</p>}
        </>
      )}
    </div>
  );
};

export default UserDetailsPreview;
