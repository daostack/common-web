import React, { FC } from "react";
import classNames from "classnames";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { InboxIcon } from "@/shared/icons";
import { HeaderContent_v04 } from "../HeaderContent_v04";
import NewDirectMessageButton from "../NewDirectMessageButton/NewDirectMessageButton";
import styles from "./HeaderContent.module.scss";

interface HeaderContentProps {
  className?: string;
  streamsWithNotificationsAmount: number;
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const { className, streamsWithNotificationsAmount } = props;
  const isMobileVersion = useIsTabletView();
  // const { searchValue, searchInputToggle, onChangeSearchValue, onCloseSearch } =
  //   useSearchFeedItems();

  if (isMobileVersion) {
    return (
      <HeaderContent_v04
        className={className}
        streamsWithNotificationsAmount={streamsWithNotificationsAmount}
      />
    );
  }

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.content}>
        <InboxIcon className={styles.inboxIcon} />
        <h1 className={styles.title}>Inbox</h1>
      </div>
      <div className={styles.actionButtonsWrapper}>
        {/* {searchInputToggle.isToggledOn && (
          <SearchInput
            value={searchValue}
            placeholder="Search spaces"
            onChange={onChangeSearchValue}
            onClose={onCloseSearch}
            autoFocus
          />
        )} */}
        {/* <InboxFilterButton /> */}
        {/* {!searchInputToggle.isToggledOn && (
          <SearchButton onClick={searchInputToggle.setToggleOn} />
        )} */}
        <NewDirectMessageButton isMobileVersion={isMobileVersion} />
      </div>
    </div>
  );
};

export default HeaderContent;
