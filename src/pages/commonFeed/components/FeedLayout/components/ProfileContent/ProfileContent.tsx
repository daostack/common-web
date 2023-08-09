import React, { FC, useEffect } from "react";
import classNames from "classnames";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { countryList } from "@/shared/assets/countries";
import { UserAvatar } from "@/shared/components";
import {
  useCommon,
  useGovernanceByCommonId,
  useRootCommonMembershipIntro,
  useUserById,
} from "@/shared/hooks/useCases";
import { DateFormat } from "@/shared/models";
import { Button, ButtonVariant, Loader } from "@/shared/ui-kit";
import {
  formatDate,
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
  getUserName,
} from "@/shared/utils";
import styles from "./ProfileContent.module.scss";

interface ProfileContentProps {
  className?: string;
  userId: string;
  commonId?: string;
}

const ProfileContent: FC<ProfileContentProps> = (props) => {
  const { userId, commonId } = props;
  const { fetchUser, data: user, fetched: isUserFetched } = useUserById();
  const {
    data: common,
    fetched: isCommonFetched,
    fetchCommon: fetchCommon,
    setCommon: setCommon,
  } = useCommon();
  const {
    data: governance,
    fetched: isGovernanceFetched,
    fetchGovernance,
    setGovernance,
  } = useGovernanceByCommonId();
  const {
    membershipIntro,
    isMembershipIntroLoading,
    fetchMembershipIntro,
    setMembershipIntro,
  } = useRootCommonMembershipIntro();
  const {
    data: commonMember,
    fetched: isCommonMemberFetched,
    fetchCommonMember,
    setCommonMember,
  } = useCommonMember({ userId });
  const userName = getUserName(user);
  const isCommonDataLoading =
    !isCommonFetched ||
    !isGovernanceFetched ||
    !isCommonMemberFetched ||
    isMembershipIntroLoading;
  const isCommonDataFetched = common && governance && commonMember;
  const className = classNames(styles.container, props.className);
  const country = countryList.find(({ value }) => value === user?.country);

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  useEffect(() => {
    if (commonId) {
      fetchGovernance(commonId);
      fetchCommon(commonId);
    } else {
      setGovernance(null);
      setCommon(null);
    }
  }, [commonId]);

  useEffect(() => {
    if (commonId) {
      fetchCommonMember(commonId, {}, true);
      fetchMembershipIntro(commonId, userId);
    } else {
      setCommonMember(null);
      setMembershipIntro("");
    }
  }, [userId, commonId]);

  if (!isUserFetched) {
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
      <h5 className={styles.userName}>{userName}</h5>
      {country && <p className={styles.country}>{country.name}</p>}
      <Button className={styles.dmButton} variant={ButtonVariant.PrimaryGray}>
        Direct message
      </Button>
      {user?.intro && (
        <>
          <h6 className={styles.infoTitle}>About</h6>
          <p className={styles.infoContent}>{user.intro}</p>
        </>
      )}
      {isCommonDataLoading && <Loader />}
      {isCommonDataFetched && (
        <>
          <h6 className={styles.infoTitle}>Membership Intro</h6>
          <p className={styles.infoContent}>
            Joined {common.name} at{" "}
            {formatDate(
              new Date(commonMember.joinedAt.seconds * 1000),
              DateFormat.SuperShortSecondary,
            )}
          </p>
          <p className={styles.infoContent}>
            {getCirclesWithHighestTier(
              getFilteredByIdCircles(
                Object.values(governance.circles),
                commonMember.circleIds,
              ),
            )
              .map((circle) => circle.name)
              .join(", ")}
          </p>
          {membershipIntro && (
            <p className={styles.infoContent}>{membershipIntro}</p>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileContent;
