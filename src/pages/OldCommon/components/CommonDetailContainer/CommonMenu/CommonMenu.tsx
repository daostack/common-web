import React, { FC, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import {
  CreateCommonModal,
  EditCommonModal,
  EditRulesModal,
} from "@/pages/OldCommon/components";
import {
  ButtonLink,
  Dropdown,
  DropdownOption,
  DropdownRef,
  MenuButton,
  Modal,
} from "@/shared/components";
import {
  GovernanceActions,
  ProposalsTypes,
  ScreenSize,
} from "@/shared/constants";
import { useAuthorizedDropdown, useAuthorizedModal } from "@/shared/hooks";
import AddIcon from "@/shared/icons/add.icon";
import AgendaIcon from "@/shared/icons/agenda.icon";
import ContributionIcon from "@/shared/icons/contribution.icon";
import TrashIcon from "@/shared/icons/trash.icon";
import { ModalType } from "@/shared/interfaces";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { hasPermission } from "@/shared/utils";
import { LeaveCommonModal } from "../LeaveCommonModal";
import { MyContributionsModal } from "../MyContributionsModal";
import "./index.scss";

export enum MenuItem {
  EditAgenda,
  EditRules,
  CreateProject,
  MyContributions,
  DeleteCommon,
  LeaveCommon,
}

interface Option extends DropdownOption {
  disabled?: boolean;
}

const OPTIONS: Option[] = [
  /*{
    text: (
      <>
        <MosaicIcon className="edit-common-menu__item-icon" /> Edit info and
        cover photo
      </>
    ),
    searchText: "Edit info and cover photo",
    value: MenuItem.EditInfo,
    className: "edit-common-menu__dropdown-menu-item--disabled",
    disabled: false,//true,
  },*/
  {
    text: (
      <>
        <AgendaIcon className="edit-common-menu__item-icon" /> Edit Agenda
      </>
    ),
    searchText: "Edit Agenda",
    value: MenuItem.EditAgenda,
    //className: "edit-common-menu__dropdown-menu-item--disabled",
    //disabled: false//true,
  },
  {
    text: (
      <>
        <AgendaIcon className="edit-common-menu__item-icon" /> Edit Rules
      </>
    ),
    searchText: "Edit Rules",
    value: MenuItem.EditRules,
  },
  {
    text: (
      <>
        <AddIcon className="edit-common-menu__item-icon" /> Create Space
      </>
    ),
    searchText: "Create Space",
    value: MenuItem.CreateProject,
  },
  {
    text: (
      <>
        <ContributionIcon className="edit-common-menu__item-icon" /> My
        contributions
      </>
    ),
    searchText: "My contributions",
    value: MenuItem.MyContributions,
  },
  {
    text: (
      <>
        <TrashIcon className="edit-common-menu__item-icon" /> Delete common
      </>
    ),
    searchText: "Delete common",
    value: MenuItem.DeleteCommon,
    className: "edit-common-menu__dropdown-menu-item--red",
  },
  {
    text: (
      <>
        <TrashIcon className="edit-common-menu__item-icon" /> Leave common
      </>
    ),
    searchText: "Leave common",
    value: MenuItem.LeaveCommon,
    className: "edit-common-menu__dropdown-menu-item--red",
  },
];

interface CommonMenuProps {
  className?: string;
  menuButtonClassName?: string;
  common: Common;
  governance: Governance;
  subCommons: Common[];
  isSubCommon: boolean;
  currentCommonMember: (CommonMember & CirclesPermissions) | null;
  withBorder?: boolean;
  onSubCommonCreate?: (common: Common) => void;
  onCommonDelete: () => void;
}

const CommonMenu: FC<CommonMenuProps> = (props) => {
  const {
    className,
    menuButtonClassName,
    common,
    governance,
    subCommons,
    isSubCommon,
    currentCommonMember,
    onSubCommonCreate,
    onCommonDelete,
    withBorder = false,
  } = props;
  const dropdownRef = useRef<DropdownRef>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null,
  );
  const circlesWithoutSubcommon = Object.values(governance.circles).filter(
    (circle) =>
      !subCommons.some(
        (subCommon) => subCommon.directParent?.circleId === circle.id,
      ),
  );
  const screenSize = useSelector(getScreenSize());
  const { onDropdownToggle } = useAuthorizedDropdown(dropdownRef);
  const {
    isModalOpen: isModalMenuShowing,
    onOpen: onMenuModalOpen,
    onClose: onMenuModalClose,
  } = useAuthorizedModal();
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isCommonMember = Boolean(currentCommonMember);
  const isCommonOwner = Boolean(
    common.founderId === currentCommonMember?.userId,
  );
  const menuItems = useMemo<MenuItem[]>(() => {
    const items: MenuItem[] = [];

    if (currentCommonMember?.allowedActions[GovernanceActions.UPDATE_COMMON]) {
      items.push(MenuItem.EditAgenda, MenuItem.EditAgenda);
      items.push(MenuItem.EditRules, MenuItem.EditRules);
    }
    if (
      !isSubCommon &&
      circlesWithoutSubcommon.length > 0 &&
      currentCommonMember &&
      hasPermission({
        commonMember: currentCommonMember,
        governance,
        key: GovernanceActions.CREATE_SUBCOMMON,
      })
    ) {
      items.push(MenuItem.CreateProject);
    }
    if (isCommonMember) {
      items.push(MenuItem.MyContributions);
    }
    if (
      currentCommonMember?.allowedProposals[ProposalsTypes.DELETE_COMMON] &&
      !isSubCommon
    ) {
      items.push(MenuItem.DeleteCommon);
    }
    if (isCommonMember && !isSubCommon) {
      items.push(MenuItem.LeaveCommon);
    }

    return items;
  }, [
    isCommonMember,
    isCommonOwner,
    isSubCommon,
    common.memberCount,
    currentCommonMember,
    circlesWithoutSubcommon,
  ]);
  const options = useMemo(
    () =>
      OPTIONS.filter((option) => menuItems.includes(option.value as MenuItem)),
    [menuItems],
  );

  const handleModalOpen = () => {
    onMenuModalOpen();
  };

  const handleSelect = (value: unknown) => {
    if (isMobileView) {
      onMenuModalClose();
    }

    setSelectedMenuItem(value as MenuItem);

    switch (value) {
      case MenuItem.DeleteCommon:
        onCommonDelete();
        break;
      default:
        break;
    }
  };

  const handleMenuClose = () => {
    setSelectedMenuItem(null);

    if (isMobileView) {
      handleModalOpen();
    } else {
      setTimeout(() => {
        dropdownRef.current?.openDropdown();
      }, 0);
    }
  };

  const buttonElement = (
    <MenuButton
      onClick={isMobileView ? handleModalOpen : undefined}
      className={menuButtonClassName}
      withBorder={withBorder}
    />
  );

  const renderMenuDropdown = () => (
    <Dropdown
      ref={dropdownRef}
      className="edit-common-menu__dropdown"
      options={options}
      onSelect={handleSelect}
      shouldBeFixed={false}
      menuButton={buttonElement}
      styles={{
        menu: "edit-common-menu__dropdown-menu",
        menuList: "edit-common-menu__dropdown-menu-list",
        menuItem: "edit-common-menu__dropdown-menu-item",
      }}
      onMenuToggle={onDropdownToggle}
    />
  );

  const renderMenuModal = () => (
    <>
      {buttonElement}
      <Modal
        isShowing={isModalMenuShowing}
        onClose={onMenuModalClose}
        type={ModalType.MobilePopUp}
        mobileFullScreen
        title={<h3 className="edit-common-menu__menu-modal-title">Options</h3>}
        withoutHorizontalPadding
      >
        <ul className="edit-common-menu__menu-modal-list">
          {options.map((option) => (
            <li key={String(option.value)}>
              <ButtonLink
                className={classNames(
                  "edit-common-menu__menu-modal-button",
                  option.className,
                  {
                    "edit-common-menu__menu-modal-button--disabled":
                      option.disabled,
                  },
                )}
                onClick={
                  !option.disabled
                    ? () => handleSelect(option.value)
                    : undefined
                }
              >
                {option.text}
              </ButtonLink>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );

  return (
    <div className={classNames("edit-common-menu", className)}>
      {isMobileView ? renderMenuModal() : renderMenuDropdown()}
      <MyContributionsModal
        isShowing={selectedMenuItem === MenuItem.MyContributions}
        onClose={handleMenuClose}
        common={common}
        isSubCommon={Boolean(common.directParent)}
      />
      {currentCommonMember && (
        <LeaveCommonModal
          isShowing={selectedMenuItem === MenuItem.LeaveCommon}
          onClose={handleMenuClose}
          commonId={common.id}
          memberCount={common.memberCount}
          memberCircleIds={Object.values(currentCommonMember.circles.map)}
        />
      )}
      <CreateCommonModal
        isShowing={selectedMenuItem === MenuItem.CreateProject}
        onClose={handleMenuClose}
        governance={governance}
        parentCommonId={common.id}
        isSubCommonCreation={!isSubCommon}
        subCommons={subCommons}
        onCommonCreate={onSubCommonCreate}
        shouldBeWithoutIntroduction
      />
      <EditCommonModal
        isShowing={selectedMenuItem === MenuItem.EditAgenda}
        onClose={handleMenuClose}
        governance={governance}
        common={common}
        parentCommonId={common.id}
        isSubCommonCreation={!isSubCommon}
        shouldBeWithoutIntroduction
      />
      <EditRulesModal
        isShowing={selectedMenuItem === MenuItem.EditRules}
        onClose={handleMenuClose}
        common={common}
        governance={governance}
        parentCommonId={common.id}
        shouldBeWithoutIntroduction={false}
        isSubCommon={isSubCommon}
      />
    </div>
  );
};

export default CommonMenu;
