import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Modal } from "@/shared/components";
import { KeyboardKeys } from "@/shared/constants";
import { Loader } from "@/shared/ui-kit";
import { DirectMessageUserItem, SearchInput } from "./components";
import { useDMUsers } from "./hooks";
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
  const {
    loading: areDMUsersLoading,
    dmUsers,
    fetchDMUsers,
    error: dmUsersFetchError,
  } = useDMUsers();
  const filteredDMUsers = useMemo(() => {
    if (!searchText) {
      return dmUsers;
    }

    const lowerCasedSearchText = searchText.toLowerCase();

    return dmUsers.filter((item) =>
      item.userName.toLowerCase().startsWith(lowerCasedSearchText),
    );
  }, [dmUsers, searchText]);
  const totalUsersAmount = filteredDMUsers.length;

  const handleArrowUp = useCallback(() => {
    setActiveItemIndex((currentIndex) => {
      if (totalUsersAmount === 0) {
        return null;
      }
      if (currentIndex === null) {
        return totalUsersAmount - 1;
      }

      const nextIndex = currentIndex - 1;

      return nextIndex < 0 ? totalUsersAmount - 1 : nextIndex;
    });
  }, [totalUsersAmount]);

  const handleArrowDown = useCallback(() => {
    setActiveItemIndex((currentIndex) => {
      if (totalUsersAmount === 0) {
        return null;
      }
      if (currentIndex === null) {
        return 0;
      }

      const nextIndex = currentIndex + 1;

      return nextIndex >= totalUsersAmount ? 0 : nextIndex;
    });
  }, [totalUsersAmount]);

  useEffect(() => {
    if (isOpen) {
      fetchDMUsers();
      return;
    }

    setActiveItemIndex(null);
    setSearchText("");
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

  const renderContent = (): ReactElement => {
    if (areDMUsersLoading) {
      return <Loader />;
    }

    if (dmUsersFetchError) {
      return (
        <p className={styles.infoText}>
          Oops! Something went wrong while loading the user list. Please try
          again later.
        </p>
      );
    }

    if (totalUsersAmount === 0) {
      return <p className={styles.infoText}>No users found</p>;
    }

    return (
      <ul ref={listRef} className={styles.itemList}>
        {filteredDMUsers.map((item, index) => {
          const isActive = index === activeItemIndex;

          return (
            <li
              key={item.uid}
              className={styles.item}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              onFocus={() => setActiveItemIndex(index)}
            >
              <DirectMessageUserItem
                className={styles.userItem}
                image={item.photoURL}
                name={item.userName}
                isActive={isActive}
              />
            </li>
          );
        })}
      </ul>
    );
  };

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
      mobileFullScreen
      styles={{
        modalOverlay: styles.modalOverlay,
        headerWrapper: styles.modalHeaderWrapper,
        header: styles.modalHeader,
        content: styles.modalContent,
        closeWrapper: styles.modalCloseWrapper,
      }}
    >
      <div className={styles.content}>{renderContent()}</div>
    </Modal>
  );
};

export default DirectMessageModal;
