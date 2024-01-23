import React, { FC } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { useSearchFeedItems } from "@/pages/commonFeed/components/HeaderContent/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { InboxIcon } from "@/shared/icons";
import { SearchButton, SearchInput } from "@/shared/ui-kit";
import { inboxActions } from "@/store/states";
import { HeaderContent_v04 } from "../HeaderContent_v04";
import { InboxFilterButton } from "../InboxFilterButton";
import NewDirectMessageButton from "../NewDirectMessageButton/NewDirectMessageButton";
import styles from "./HeaderContent.module.scss";

interface HeaderContentProps {
  className?: string;
  streamsWithNotificationsAmount: number;
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const { className, streamsWithNotificationsAmount } = props;
  const dispatch = useDispatch();
  const isMobileVersion = useIsTabletView();
  const searchInboxItemsData = useSearchFeedItems({
    onSearch: (value) => dispatch(inboxActions.searchInboxItems(value)),
    onResetSearchState: () => dispatch(inboxActions.resetSearchState()),
  });
  const { searchValue, searchInputToggle, onChangeSearchValue, onCloseSearch } =
    searchInboxItemsData;

  if (isMobileVersion) {
    return (
      <HeaderContent_v04
        className={className}
        streamsWithNotificationsAmount={streamsWithNotificationsAmount}
        searchInboxItemsData={searchInboxItemsData}
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
        {searchInputToggle.isToggledOn && (
          <SearchInput
            value={searchValue}
            placeholder="Search inbox"
            onChange={onChangeSearchValue}
            onClose={onCloseSearch}
            autoFocus
          />
        )}
        <InboxFilterButton onClick={onCloseSearch} />
        {!searchInputToggle.isToggledOn && (
          <SearchButton onClick={searchInputToggle.setToggleOn} />
        )}
        <NewDirectMessageButton
          isMobileVersion={isMobileVersion}
          onClick={onCloseSearch}
        />
      </div>
    </div>
  );
};

export default HeaderContent;
