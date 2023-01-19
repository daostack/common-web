import React, { FC } from "react";
import { Modal } from "@/shared/components";
import styles from "./MobileModal.module.scss";

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalVotes: number;
  totalMembersWithVotingRight: number;
}

export const MobileModal: FC<MobileModalProps> = (props) => {
  const { isOpen, onClose, totalVotes, totalMembersWithVotingRight, children } =
    props;

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={onClose}
      title={
        <div className={styles.modalTitleWrapper}>
          <h3 className={styles.modalTitle}>
            Votes {totalVotes}/{totalMembersWithVotingRight}
          </h3>
        </div>
      }
      isHeaderSticky
      styles={{
        modalOverlay: styles.modalOverlay,
        header: styles.modalHeader,
        content: styles.modalContent,
      }}
    >
      <div className={styles.content}>{children}</div>
    </Modal>
  );
};
