import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "@/shared/components";
import { KeyboardKeys } from "@/shared/constants";
import { DirectMessageUserItem, SearchInput } from "./components";
import styles from "./DirectMessageModal.module.scss";

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobileVersion?: boolean;
}

const DirectMessageModal: FC<DirectMessageModalProps> = (props) => {
  const { isOpen, onClose, isMobileVersion = false } = props;
  const listRef = useRef<HTMLUListElement>(null);
  const [searchText, setSearchText] = useState("");
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleArrowUp = useCallback(() => {
    setActiveItemIndex((currentIndex) => {
      if (items.length === 0) {
        return null;
      }
      if (currentIndex === null) {
        return items.length - 1;
      }

      const nextIndex = currentIndex - 1;

      return nextIndex < 0 ? items.length - 1 : nextIndex;
    });
  }, [items]);

  const handleArrowDown = useCallback(() => {
    setActiveItemIndex((currentIndex) => {
      if (items.length === 0) {
        return null;
      }
      if (currentIndex === null) {
        return 0;
      }

      const nextIndex = currentIndex + 1;

      return nextIndex >= items.length ? 0 : nextIndex;
    });
  }, [items]);

  useEffect(() => {
    if (!isOpen) {
      setActiveItemIndex(null);
      setSearchText("");
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveItemIndex(null);
  }, [searchText]);

  useEffect(() => {
    if (activeItemIndex !== null) {
      const listElement = listRef.current?.children.item(activeItemIndex);
      listElement?.scrollIntoView(false);
    }
  }, [activeItemIndex]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handler = (event: KeyboardEvent) => {
      const key = event.key as KeyboardKeys;

      switch (key) {
        case KeyboardKeys.ArrowUp:
          handleArrowUp();
          break;
        case KeyboardKeys.ArrowDown:
          handleArrowDown();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keyup", handler);

    return () => {
      window.removeEventListener("keyup", handler);
    };
  }, [isOpen, handleArrowUp, handleArrowDown]);

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={onClose}
      title={
        <div className={styles.modalTitleWrapper}>
          <h3 className={styles.modalTitle}>Direct message</h3>
          <SearchInput value={searchText} onChange={setSearchText} autoFocus />
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
        <ul ref={listRef} className={styles.itemList}>
          {items.map((item, index) => {
            const isActive = index === activeItemIndex;

            return (
              <li
                key={index}
                className={styles.item}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                onFocus={() => setActiveItemIndex(index)}
              >
                <DirectMessageUserItem
                  className={styles.userItem}
                  image="https://lh3.googleusercontent.com/a-/AOh14GheOzF9_fO5iwVRvoOjTQNWutv8kf7caOZNGFHBqw=s96-c"
                  name="Andrey Mikhadyuk"
                  lastActivity={
                    Date.now() - 3 * 60 * 60 * 1000 - 35 * 45 * 1000
                  }
                  notificationsAmount={5}
                  isActive={isActive}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
};

export default DirectMessageModal;
