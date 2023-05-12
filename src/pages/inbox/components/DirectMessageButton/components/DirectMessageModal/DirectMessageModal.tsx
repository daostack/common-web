import React, { FC, useState } from "react";
import { Modal } from "@/shared/components";
import { SearchInput } from "./components";
import styles from "./DirectMessageModal.module.scss";

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobileVersion?: boolean;
}

const DirectMessageModal: FC<DirectMessageModalProps> = (props) => {
  const { isOpen, onClose, isMobileVersion = false } = props;
  const [searchText, setSearchText] = useState("");

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={onClose}
      title={
        <div className={styles.modalTitleWrapper}>
          <h3 className={styles.modalTitle}>Direct message</h3>
        </div>
      }
      isHeaderSticky
      hideCloseButton={!isMobileVersion}
      styles={{
        modalOverlay: styles.modalOverlay,
        headerWrapper: styles.modalHeaderWrapper,
        header: styles.modalHeader,
        content: styles.modalContent,
      }}
    >
      <div className={styles.content}>
        <SearchInput
          className={styles.searchInput}
          value={searchText}
          onChange={setSearchText}
        />
      </div>
    </Modal>
  );
};

export default DirectMessageModal;
