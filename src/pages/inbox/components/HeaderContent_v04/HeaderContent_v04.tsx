import React, { FC, useEffect, useRef } from "react";
import classNames from "classnames";
import { SearchFeedItemsData } from "@/pages/commonFeed/components/HeaderContent/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { InboxIcon } from "@/shared/icons";
import { SearchButton, SearchInput, SearchInputRef } from "@/shared/ui-kit";
import { getPluralEnding } from "@/shared/utils";
import { InboxFilterButton } from "../InboxFilterButton";
import NewDirectMessageButton from "../NewDirectMessageButton/NewDirectMessageButton";
import styles from "./HeaderContent_v04.module.scss";

interface HeaderContentProps {
  className?: string;
  streamsWithNotificationsAmount: number;
  searchInboxItemsData?: SearchFeedItemsData;
}

const HeaderContent_v04: FC<HeaderContentProps> = (props) => {
  const { className, streamsWithNotificationsAmount, searchInboxItemsData } =
    props;
  const isMobileVersion = useIsTabletView();
  const searchInputRef = useRef<SearchInputRef>(null);

  useEffect(() => {
    if (!isMobileVersion) {
      return;
    }

    function handleScroll() {
      searchInputRef.current?.blur();
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileVersion]);

  const renderSearchInput = () => {
    if (!searchInboxItemsData) {
      return null;
    }

    const {
      searchValue,
      searchInputToggle,
      onChangeSearchValue,
      onCloseSearch,
    } = searchInboxItemsData;

    if (!searchInputToggle.isToggledOn) {
      return null;
    }

    return (
      <div className={styles.searchWrapper}>
        <SearchInput
          value={searchValue}
          isSearchIconVisible={false}
          ref={searchInputRef}
          onChange={onChangeSearchValue}
          onClose={onCloseSearch}
          autoFocus
        />
      </div>
    );
  };

  const renderSearchButton = () => {
    if (!searchInboxItemsData) {
      return null;
    }

    const { searchInputToggle } = searchInboxItemsData;

    if (searchInputToggle.isToggledOn) {
      return null;
    }

    return <SearchButton onClick={searchInputToggle.setToggleOn} />;
  };

  return (
    <>
      <div className={classNames(styles.container, className)}>
        <div className={styles.content}>
          <div className={styles.infoContainer}>
            <InboxIcon className={styles.inboxIcon} />
            <div className={styles.infoWrapper}>
              <h1 className={styles.title}>Inbox</h1>
              <p className={styles.streamsWithNotificationsAmount}>
                {streamsWithNotificationsAmount} unread stream
                {getPluralEnding(streamsWithNotificationsAmount)}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.actionButtonsWrapper}>
          {renderSearchButton()}
          <InboxFilterButton />
          <NewDirectMessageButton
            isMobileVersion={isMobileVersion}
            onClick={searchInboxItemsData?.onCloseSearch}
          />
        </div>
      </div>
      {renderSearchInput()}
    </>
  );
};

export default HeaderContent_v04;
