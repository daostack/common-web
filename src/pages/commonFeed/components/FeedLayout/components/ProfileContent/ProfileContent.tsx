import React, { FC, useEffect } from "react";
import classNames from "classnames";
import { countryList } from "@/shared/assets/countries";
import { UserAvatar } from "@/shared/components";
import { useUserById } from "@/shared/hooks/useCases";
import { Loader } from "@/shared/ui-kit";
import { getUserName } from "@/shared/utils";
import styles from "./ProfileContent.module.scss";

interface ProfileContentProps {
  className?: string;
  userId: string;
  commonId?: string;
}

const ProfileContent: FC<ProfileContentProps> = (props) => {
  const { userId, commonId } = props;
  const { fetchUser, data: user, fetched: isUserFetched } = useUserById();
  const userName = getUserName(user);
  const isLoading = !isUserFetched;
  const className = classNames(styles.container, props.className);
  const country = countryList.find(({ value }) => value === user?.country);

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  if (isLoading) {
    return (
      <div className={className}>
        <Loader className={styles.loader} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={className}>
        <p className={styles.errorText}>Something went wrong</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <UserAvatar
        className={styles.userAvatar}
        photoURL={user?.photoURL}
        nameForRandomAvatar={userName}
        userName={userName}
      />
      <h6 className={styles.userName}>{userName}</h6>
      {country && <p className={styles.country}>{country.name}</p>}
    </div>
  );
};

export default ProfileContent;
