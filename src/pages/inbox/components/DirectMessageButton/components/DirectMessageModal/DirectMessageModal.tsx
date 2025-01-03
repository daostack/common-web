import React, { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Select, { components } from "react-select";
import { Modal, UserAvatar } from "@/shared/components";
import { useDMUserChatChannel } from "@/shared/hooks/useCases";
import useThemeColor from "@/shared/hooks/useThemeColor";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { SearchIcon } from "@/shared/icons";
import { Button, ButtonVariant, Loader } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import { inboxActions } from "@/store/states";
import { useDMUsers } from "./hooks";
import { selectorStyles } from "./selectorStyles";
import styles from "./DirectMessageModal.module.scss";

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobileVersion?: boolean;
  isGroupMessage?: boolean;
}

interface SelectOption {
  value: string;
  label: JSX.Element;
  shortLabel: JSX.Element;
  uid: string;
}

const DirectMessageModal: FC<DirectMessageModalProps> = (props) => {
  const {
    isOpen,
    onClose,
    isMobileVersion = false,
    isGroupMessage = false,
  } = props;
  const dispatch = useDispatch();
  const { getThemeColor } = useThemeColor();
  const isTabletView = useIsTabletView();
  const {
    loading: areDMUsersLoading,
    dmUsers,
    error: dmUsersFetchError,
  } = useDMUsers();
  const {
    loading: isChannelLoading,
    dmUserChatChannel,
    fetchDMUserChatChannel,
    resetDMUserChatChannel,
    error: isChannelLoadedWithError,
  } = useDMUserChatChannel();
  const [groupUids, setGroupUids] = useState<string[]>([]);

  const handleChatCreate = (uids: string[]) => {
    fetchDMUserChatChannel(uids);
  };

  useEffect(() => {
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
      shortLabel: <span className={styles.shortLabel}>{user.userName}</span>,
      uid: user.uid,
    }));

    const handleItemClick = (selectedItems) => {
      if (!isGroupMessage) {
        handleChatCreate([selectedItems.uid]);
      } else {
        const uids = selectedItems.map((item) => item.uid);
        setGroupUids(uids);
      }
    };

    return (
      <>
        <Select
          onChange={handleItemClick}
          isMulti={isGroupMessage}
          options={options}
          placeholder="Search"
          autoFocus
          menuIsOpen
          isSearchable
          styles={selectorStyles(getThemeColor, isTabletView)}
          components={{
            DropdownIndicator: () => (
              <SearchIcon className={styles.searchIcon} />
            ),
            IndicatorSeparator: () => null,
            MultiValue: (props) => (
              <components.MultiValue {...props}>
                {props.data.shortLabel}
              </components.MultiValue>
            ),
          }}
        />
        {isGroupMessage && (
          <Button
            onClick={() => handleChatCreate(groupUids)}
            variant={ButtonVariant.PrimaryPink}
            disabled={!groupUids.length}
            className={styles.createGroupChatButton}
          >
            Create
          </Button>
        )}
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
            {isGroupMessage ? "Group message" : "Direct message"}
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
