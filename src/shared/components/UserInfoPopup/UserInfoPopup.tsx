import React from "react";
import { getCountryNameFromCode } from "@/shared/assets/countries";
import { useCommonMemberWithUserInfo } from "@/shared/hooks/useCases";
import { Loader } from "../Loader";
import { Modal } from "../Modal";
import { UserAvatar } from "../UserAvatar";
import styles from "./UserInfoPopup.module.scss";

interface UserInfoPopupProps {
  commonId?: string;
  userId?: string;
  avatar?: string;
  isShowing: boolean;
  onClose: () => void;
}

const UserInfoPopup = ({
  commonId,
  userId,
  avatar,
  isShowing,
  onClose,
}: UserInfoPopupProps) => {
  const { data, fetched } = useCommonMemberWithUserInfo(commonId, userId);

  return (
    <Modal
      isShowing={isShowing}
      onClose={onClose}
      mobileFullScreen
      className={styles.modal}
    >
      {fetched ? (
        <div className={styles.content}>
          <div className={styles.header}>
            <UserAvatar photoURL={avatar} className={styles.userAvatar} />
            <div className={styles.userInfo}>
              <div className={styles.userName}>{data?.user.displayName}</div>
              <div className={styles.country}>
                {getCountryNameFromCode(data?.user.country)}
              </div>
            </div>
          </div>

          <div className={styles.body}>
            {data?.user.intro && (
              <>
                <div className={styles.bodySectionTitle}>Membership intro</div>
                <div>{data?.user.intro}</div>
              </>
            )}
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </Modal>
  );
};

export default UserInfoPopup;
