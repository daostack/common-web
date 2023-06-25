import React, { useEffect, useState } from "react";
import { fetchUserMemberAdmittanceProposalWithCommonId } from "@/pages/OldCommon/store/api";
import { getCountryNameFromCode } from "@/shared/assets/countries";
import { useCommonMemberWithUserInfo } from "@/shared/hooks/useCases";
import { Proposal } from "@/shared/models";
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
  const [memberAdmittanceProposal, setMemberAdmittanceProposal] =
    useState<Proposal | null>(null);

  useEffect(() => {
    (async () => {
      if (userId && commonId) {
        const proposal = await fetchUserMemberAdmittanceProposalWithCommonId(
          userId,
          commonId,
        );
        setMemberAdmittanceProposal(proposal);
      }
    })();
  }, [userId, commonId]);

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
              <div className={styles.circles}>{data?.circleIds}</div>
              <div className={styles.country}>
                {getCountryNameFromCode(data?.user.country)}
              </div>
            </div>
          </div>

          {memberAdmittanceProposal && (
            <div className={styles.body}>
              <div className={styles.bodySectionTitle}>About</div>
              <div>{memberAdmittanceProposal.data.args.description}</div>
            </div>
          )}

          {data?.user.intro && (
            <div className={styles.body}>
              <div className={styles.bodySectionTitle}>Membership intro</div>
              <div>{data?.user.intro}</div>
            </div>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </Modal>
  );
};

export default UserInfoPopup;
