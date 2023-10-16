import React, { FC } from "react";
import { countryList } from "@/shared/assets/countries";
import { User } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import styles from "./UserDetailsPreview.module.scss";

interface UserDetailsPreviewProps {
  user: User;
}

const UserDetailsPreview: FC<UserDetailsPreviewProps> = (props) => {
  const { user } = props;
  const country = countryList.find((item) => item.value === user.country);

  return (
    <div className={styles.container}>
      <div>
        <p className={styles.name}>{getUserName(user)}</p>
        {user.email && <p className={styles.info}>{user.email}</p>}
        {country && <p className={styles.info}>{country.name}</p>}
      </div>
      {user.intro && (
        <div className={styles.introWrapper}>
          <h4 className={styles.introTitle}>Intro</h4>
          <p className={styles.introContent}>{user.intro}</p>
        </div>
      )}
    </div>
  );
};

export default UserDetailsPreview;
