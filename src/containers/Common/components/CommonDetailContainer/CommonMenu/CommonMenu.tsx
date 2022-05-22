import React, { useMemo, useRef, useState, FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectUser } from "@/containers/Auth/store/selectors";
import {
  ButtonLink,
  Dropdown,
  DropdownOption,
  DropdownRef,
  Modal,
  MenuButton,
} from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { useAuthorizedDropdown, useAuthorizedModal } from "@/shared/hooks";
import AgendaIcon from "@/shared/icons/agenda.icon";
import ContributionIcon from "@/shared/icons/contribution.icon";
import MosaicIcon from "@/shared/icons/mosaic.icon";
import TrashIcon from "@/shared/icons/trash.icon";
import { ModalType } from "@/shared/interfaces";
import { Common, MemberPermission } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { DeleteCommonPrompt } from "../DeleteCommonPrompt";
import { LeaveCommonPrompt } from "../LeaveCommonPrompt";
import { MyContributionsModal } from "../MyContributionsModal";
import "./index.scss";

export enum MenuItem {
  EditInfo,
  EditRules,
  MyContributions,
  DeleteCommon,
  LeaveCommon,
}

interface Option extends DropdownOption {
  disabled?: boolean;
}

const OPTIONS: Option[] = [
  {
    text: (
      <>
        <MosaicIcon className="edit-common-menu__item-icon" /> Edit info and
        cover photo
      </>
    ),
    searchText: "Edit info and cover photo",
    value: MenuItem.EditInfo,
    className: "edit-common-menu__dropdown-menu-item--disabled",
    disabled: true,
  },
  {
    text: (
      <>
        <AgendaIcon className="edit-common-menu__item-icon" /> Edit rules
      </>
    ),
    searchText: "Edit rules",
    value: MenuItem.EditRules,
    className: "edit-common-menu__dropdown-menu-item--disabled",
    disabled: true,
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
  withBorder?: boolean;
}

const CommonMenu: FC<CommonMenuProps> = (props) => {
  const { className, menuButtonClassName, common, withBorder = false } = props;
  const dropdownRef = useRef<DropdownRef>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );
  const screenSize = useSelector(getScreenSize());
  const user = useSelector(selectUser());
  const { onDropdownToggle } = useAuthorizedDropdown(dropdownRef);
  const {
    isModalOpen: isModalMenuShowing,
    onOpen: onMenuModalOpen,
    onClose: onMenuModalClose,
  } = useAuthorizedModal();
  const isMobileView = screenSize === ScreenSize.Mobile;
  const commonMember = common?.members.find(
    (member) => member.userId === user?.uid
  );
  const isCommonMember = Boolean(commonMember);
  const isCommonOwner = Boolean(
    commonMember?.permission === MemberPermission.Founder
  );
  const menuItems = useMemo<MenuItem[]>(() => {
    const items: MenuItem[] = [];

    if (isCommonOwner) {
      items.push(MenuItem.EditInfo, MenuItem.EditRules);
    }
    if (isCommonMember) {
      items.push(MenuItem.MyContributions);
    }
    if (isCommonOwner && common.members.length === 1) {
      items.push(MenuItem.DeleteCommon);
    }
    if (isCommonMember && !isCommonOwner) {
      items.push(MenuItem.LeaveCommon);
    }

    return items;
  }, [isCommonMember, isCommonOwner, common.members]);
  const options = useMemo(
    () =>
      OPTIONS.filter((option) => menuItems.includes(option.value as MenuItem)),
    [menuItems]
  );

  const handleModalOpen = () => {
    onMenuModalOpen();
  };

  const handleSelect = (value: unknown) => {
    if (isMobileView) {
      onMenuModalClose();
    }

    setSelectedMenuItem(value as MenuItem);
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
                  }
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
      <DeleteCommonPrompt
        isShowing={selectedMenuItem === MenuItem.DeleteCommon}
        onClose={handleMenuClose}
        commonId={common.id}
      />
      <MyContributionsModal
        isShowing={selectedMenuItem === MenuItem.MyContributions}
        onClose={handleMenuClose}
        common={common}
      />
      <LeaveCommonPrompt
        isShowing={selectedMenuItem === MenuItem.LeaveCommon}
        onClose={handleMenuClose}
        commonId={common.id} />
    </div>
  );
};

export default CommonMenu;
