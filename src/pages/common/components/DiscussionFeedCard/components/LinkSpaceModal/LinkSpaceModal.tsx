import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { Modal } from "@/shared/components";
import { KeyboardKeys } from "@/shared/constants";
import { useDMUserChatChannel } from "@/shared/hooks/useCases";
import { DMUser } from "@/shared/interfaces";
import { Loader } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import { inboxActions } from "@/store/states";
import { useDMUsers } from "./hooks";
import styles from "./LinkSpaceModal.module.scss";

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const LinkSpaceModal: FC<DirectMessageModalProps> = (props) => {
  const { isOpen, onClose, title } = props;
  const dispatch = useDispatch();
  const listRef = useRef<HTMLUListElement>(null);
  const [searchText, setSearchText] = useState("");
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const {
    loading: areDMUsersLoading,
    dmUsers,
    fetchDMUsers,
    error: dmUsersFetchError,
  } = useDMUsers();
  const {
    loading: isChannelLoading,
    dmUserChatChannel,
    fetchDMUserChatChannel,
    resetDMUserChatChannel,
  } = useDMUserChatChannel();
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

  const handleUserItemClick = (item: DMUser) => {
    fetchDMUserChatChannel(item.uid);
  };

  useEffect(() => {
    if (isOpen) {
      fetchDMUsers();
      return;
    }

    setActiveItemIndex(null);
    setSearchText("");
    resetDMUserChatChannel();
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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handler = (event: KeyboardEvent) => {
      const key = event.key as KeyboardKeys;

      if (key !== KeyboardKeys.Enter) {
        return;
      }

      const item = filteredDMUsers.find(
        (dmUser, index) => index === activeItemIndex,
      );

      if (item) {
        handleUserItemClick(item);
      }
    };

    window.addEventListener("keyup", handler);

    return () => {
      window.removeEventListener("keyup", handler);
    };
  }, [isOpen, activeItemIndex, filteredDMUsers]);

  useEffect(() => {
    if (dmUserChatChannel) {
      dispatch(inboxActions.addChatChannelItem(dmUserChatChannel));
      onClose();
    }
  }, [dmUserChatChannel]);

  const renderContent = (): ReactElement => {
    if (areDMUsersLoading || isChannelLoading) {
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

    return <>empty</>;
  };

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={isChannelLoading ? emptyFunction : onClose}
      title={`Link ${title}`}
      isHeaderSticky
      hideCloseButton={isChannelLoading}
      mobileFullScreen
      styles={{
        header: styles.modalHeader,
        title: styles.modalTitle,
        content: styles.modalContent,
        closeWrapper: styles.modalCloseWrapper,
      }}
    >
      <div className={styles.content}>{renderContent()}</div>
    </Modal>
  );
};

export default LinkSpaceModal;
