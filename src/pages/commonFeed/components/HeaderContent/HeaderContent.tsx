import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { useCommonFollow } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { SearchButton, SearchInput } from "@/shared/ui-kit";
import { checkIsProject } from "@/shared/utils";
import { commonActions } from "@/store/states";
import {
  ActionsButton,
  HeaderCommonContent,
  HeaderContentWrapper,
  NewStreamButton,
} from "./components";
import { useSearchFeedItems } from "./hooks";
import styles from "./HeaderContent.module.scss";

interface HeaderContentProps {
  className?: string;
  common: Common;
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Governance;
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const { className, common, commonMember, governance } = props;
  const dispatch = useDispatch();
  const isMobileVersion = useIsTabletView();
  const commonFollow = useCommonFollow(common.id, commonMember);
  const { searchValue, searchInputToggle, onChangeSearchValue, onCloseSearch } =
    useSearchFeedItems({
      onSearch: (value) => dispatch(commonActions.searchFeedItems(value)),
      onResetSearchState: () => dispatch(commonActions.resetSearchState()),
    });
  const showFollowIcon =
    !isMobileVersion &&
    (commonFollow.isFollowInProgress
      ? !commonMember?.isFollowing
      : commonMember?.isFollowing);

  return (
    <HeaderContentWrapper className={className}>
      <HeaderCommonContent
        commonId={common.id}
        commonName={common.name}
        commonImage={common.image}
        notion={common.notion}
        isProject={checkIsProject(common)}
        memberCount={common.memberCount}
        showFollowIcon={showFollowIcon}
      />
      <div className={styles.actionButtonsWrapper}>
        {!isMobileVersion && (
          <>
            {searchInputToggle.isToggledOn && (
              <SearchInput
                value={searchValue}
                placeholder="Search space"
                onChange={onChangeSearchValue}
                onClose={onCloseSearch}
                autoFocus
              />
            )}
            {!searchInputToggle.isToggledOn && (
              <SearchButton onClick={searchInputToggle.setToggleOn} />
            )}
          </>
        )}
        <NewStreamButton
          commonId={common.id}
          commonMember={commonMember}
          governance={governance}
          isMobileVersion={isMobileVersion}
          onClick={onCloseSearch}
        />
        <ActionsButton
          common={common}
          commonMember={commonMember}
          commonFollow={commonFollow}
        />
      </div>
    </HeaderContentWrapper>
  );
};

export default HeaderContent;
