import React, { FC, useState } from "react";
import { Modal } from "@/shared/components";
import { DirectMessageUserItem, SearchInput } from "./components";
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
        <ul className={styles.itemList}>
          <li className={styles.item}>
            <DirectMessageUserItem
              image="https://lh3.googleusercontent.com/a-/AOh14GheOzF9_fO5iwVRvoOjTQNWutv8kf7caOZNGFHBqw=s96-c"
              name="Andrey Mikhadyuk"
              lastActivity={Date.now() - 3 * 60 * 60 * 1000 - 35 * 45 * 1000}
              notificationsAmount={5}
            />
          </li>
          <li className={styles.item}>
            <DirectMessageUserItem
              image="https://lh3.googleusercontent.com/a-/AOh14GheOzF9_fO5iwVRvoOjTQNWutv8kf7caOZNGFHBqw=s96-c"
              name="Andrey Mikhadyuk"
            />
          </li>
        </ul>
      </div>
    </Modal>
  );
};

export default DirectMessageModal;
