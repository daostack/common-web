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
import Select from "react-select";
import { Modal, UserAvatar } from "@/shared/components";
import { KeyboardKeys } from "@/shared/constants";
import { useDMUserChatChannel } from "@/shared/hooks/useCases";
import useThemeColor from "@/shared/hooks/useThemeColor";
import { SearchIcon } from "@/shared/icons";
import { DMUser } from "@/shared/interfaces";
import { Button, Loader } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import { inboxActions } from "@/store/states";
import { DirectMessageUserItem, SearchInput } from "./components";
import { selectorStyles } from "./components/selectorStyles";
import { useDMUsers } from "./hooks";
import styles from "./DirectMessageModal.module.scss";

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobileVersion?: boolean;
  groupMessage?: boolean;
}

const DirectMessageModal: FC<DirectMessageModalProps> = (props) => {
  const {
    isOpen,
    onClose,
    isMobileVersion = false,
    groupMessage = false,
  } = props;
  const dispatch = useDispatch();
  const { getThemeColor } = useThemeColor();
  const listRef = useRef<HTMLUListElement>(null);
  //const [searchText, setSearchText] = useState("");
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
    error: isChannelLoadedWithError,
  } = useDMUserChatChannel();

  // const filteredDMUsers = useMemo(() => {
  //   if (!searchText) {
  //     return dmUsers;
  //   }

  //   const lowerCasedSearchText = searchText.toLowerCase();

  //   return dmUsers.filter((item) =>
  //     item.userName.toLowerCase().startsWith(lowerCasedSearchText),
  //   );
  // }, [dmUsers, searchText]);

  //const totalUsersAmount = filteredDMUsers.length;

  // const handleArrowUp = useCallback(() => {
  //   setActiveItemIndex((currentIndex) => {
  //     if (totalUsersAmount === 0) {
  //       return null;
  //     }
  //     if (currentIndex === null) {
  //       return totalUsersAmount - 1;
  //     }

  //     const nextIndex = currentIndex - 1;

  //     return nextIndex < 0 ? totalUsersAmount - 1 : nextIndex;
  //   });
  // }, [totalUsersAmount]);

  // const handleArrowDown = useCallback(() => {
  //   setActiveItemIndex((currentIndex) => {
  //     if (totalUsersAmount === 0) {
  //       return null;
  //     }
  //     if (currentIndex === null) {
  //       return 0;
  //     }

  //     const nextIndex = currentIndex + 1;

  //     return nextIndex >= totalUsersAmount ? 0 : nextIndex;
  //   });
  // }, [totalUsersAmount]);

  const handleUserItemClick = (item: DMUser) => {
    fetchDMUserChatChannel(item.uid);
  };

  useEffect(() => {
    if (isOpen) {
      fetchDMUsers();
      return;
    }

    setActiveItemIndex(null);
    //setSearchText("");
    resetDMUserChatChannel();
  }, [isOpen]);

  // useEffect(() => {
  //   setActiveItemIndex(null);
  // }, [searchText]);

  useEffect(() => {
    if (activeItemIndex !== null) {
      const listElement = listRef.current?.children.item(activeItemIndex);
      listElement?.scrollIntoView(false);
    }
  }, [activeItemIndex]);

  // useEffect(() => {
  //   if (!isOpen) {
  //     return;
  //   }

  //   const handler = (event: KeyboardEvent) => {
  //     const key = event.key as KeyboardKeys;

  //     switch (key) {
  //       case KeyboardKeys.ArrowUp:
  //         handleArrowUp();
  //         break;
  //       case KeyboardKeys.ArrowDown:
  //         handleArrowDown();
  //         break;
  //       default:
  //         break;
  //     }
  //   };

  //   window.addEventListener("keyup", handler);

  //   return () => {
  //     window.removeEventListener("keyup", handler);
  //   };
  // }, [isOpen, handleArrowUp, handleArrowDown]);

  // useEffect(() => {
  //   if (!isOpen) {
  //     return;
  //   }

  //   const handler = (event: KeyboardEvent) => {
  //     const key = event.key as KeyboardKeys;

  //     if (key !== KeyboardKeys.Enter) {
  //       return;
  //     }

  //     const item = filteredDMUsers.find(
  //       (dmUser, index) => index === activeItemIndex,
  //     );

  //     if (item) {
  //       handleUserItemClick(item);
  //     }
  //   };

  //   window.addEventListener("keyup", handler);

  //   return () => {
  //     window.removeEventListener("keyup", handler);
  //   };
  // }, [isOpen, activeItemIndex, filteredDMUsers]);

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

    if (dmUsers.length === 0) {
      return <p className={styles.infoText}>No users found</p>;
    }

    const options = dmUsers.map((user) => ({
      value: user.userName,
      user: user,
      label: (
        <div className={styles.optionWrapper}>
          <UserAvatar
            className={styles.userAvatar}
            photoURL={user.photoURL}
            nameForRandomAvatar={user.userName}
            userName={user.userName}
          />
          <span>{user.userName}</span>
        </div>
      ),
    }));

    return (
      <>
        <Select
          onChange={(item) =>
            !groupMessage && item && handleUserItemClick((item as any).user)
          }
          isMulti={groupMessage}
          options={options}
          placeholder="Search"
          autoFocus
          menuIsOpen
          isSearchable
          styles={selectorStyles(getThemeColor)}
          components={{
            DropdownIndicator: () => <SearchIcon />,
            IndicatorSeparator: () => null,
          }}
        />
        {groupMessage && <Button>Create</Button>}
      </>
    );

    // return (
    //   <ul ref={listRef} className={styles.itemList}>
    //     {filteredDMUsers.map((item, index) => {
    //       const isActive = index === activeItemIndex;

    //       return (
    //         <li
    //           key={item.uid}
    //           className={styles.item}
    //           tabIndex={0}
    //           role="button"
    //           aria-pressed={isActive}
    //           onFocus={() => setActiveItemIndex(index)}
    //           onMouseDown={(event) => event.preventDefault()}
    //           onClick={() => handleUserItemClick(item)}
    //         >
    //           <DirectMessageUserItem
    //             className={styles.userItem}
    //             image={item.photoURL}
    //             name={item.userName}
    //             isActive={isActive}
    //           />
    //         </li>
    //       );
    //     })}
    //   </ul>
    // );
  };

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={isChannelLoading ? emptyFunction : onClose}
      title={
        <div className={styles.modalTitleWrapper}>
          <h3 className={styles.modalTitle}>
            {groupMessage ? "Group message" : "Direct message"}
          </h3>
          {/* {!isChannelLoading && (
            <SearchInput
              value={searchText}
              onChange={setSearchText}
              autoFocus
            />
          )} */}
        </div>
      }
      isHeaderSticky
      hideCloseButton={!isMobileVersion || isChannelLoading}
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
