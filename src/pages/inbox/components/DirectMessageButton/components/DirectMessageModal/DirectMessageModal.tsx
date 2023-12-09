import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Modal, UserAvatar } from "@/shared/components";
import { useDMUserChatChannel } from "@/shared/hooks/useCases";
import useThemeColor from "@/shared/hooks/useThemeColor";
import { SearchIcon } from "@/shared/icons";
import { DMUser } from "@/shared/interfaces";
import { Button, Loader } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import { inboxActions } from "@/store/states";
import { selectorStyles } from "./components/selectorStyles";
import { useDMUsers } from "./hooks";
import styles from "./DirectMessageModal.module.scss";

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobileVersion?: boolean;
  groupMessage?: boolean;
}

interface SelectOption {
  value: string;
  user: DMUser;
  label: JSX.Element;
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

  const handleUserItemClick = (item: DMUser) => {
    fetchDMUserChatChannel(item.uid);
  };

  useEffect(() => {
    if (isOpen) {
      fetchDMUsers();
      return;
    }

    resetDMUserChatChannel();
  }, [isOpen]);

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

    const options: SelectOption[] = dmUsers.map((user) => ({
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

    const handleClick = (item: SelectOption) => {
      if (!groupMessage) {
        handleUserItemClick(item.user);
      } else {
        console.log("HANDLE GROUP MESSAGE");
      }
    };

    return (
      <>
        <Select
          onChange={(item) => handleClick(item as SelectOption)}
          isMulti={groupMessage}
          options={options}
          placeholder="Search"
          autoFocus
          menuIsOpen
          isSearchable
          styles={selectorStyles(getThemeColor)}
          components={{
            DropdownIndicator: () => (
              <SearchIcon className={styles.searchIcon} />
            ),
            IndicatorSeparator: () => null,
          }}
        />
        {groupMessage && <Button>Create</Button>}
      </>
    );
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
        </div>
      }
      isHeaderSticky
      hideCloseButton={!isMobileVersion || isChannelLoading}
      mobileFullScreen
      styles={{
        modalOverlay: styles.modalOverlay,
        headerWrapper: styles.modalHeaderWrapper,
        header: styles.modalHeader,
        closeWrapper: styles.modalCloseWrapper,
      }}
    >
      <div className={styles.content}>{renderContent()}</div>
    </Modal>
  );
};

export default DirectMessageModal;
