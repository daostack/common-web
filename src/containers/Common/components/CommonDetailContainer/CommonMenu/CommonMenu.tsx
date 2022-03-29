import React, { useMemo, useRef, FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectUser } from "@/containers/Auth/store/selectors";
import {
  ButtonIcon,
  ButtonLink,
  Dropdown,
  DropdownOption,
  DropdownRef,
  Modal,
} from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import AgendaIcon from "@/shared/icons/agenda.icon";
import ContributionIcon from "@/shared/icons/contribution.icon";
import MenuIcon from "@/shared/icons/menu.icon";
import MosaicIcon from "@/shared/icons/mosaic.icon";
import TrashIcon from "@/shared/icons/trash.icon";
import { ModalType } from "@/shared/interfaces";
import { Common, MemberPermission } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

export enum MenuItem {
  EditInfo,
  EditRules,
  MyContributions,
  DeleteCommon,
}

const OPTIONS: DropdownOption[] = [
  {
    text: (
      <>
        <MosaicIcon className="edit-common-menu__item-icon" /> Edit info and
        cover photo
      </>
    ),
    searchText: "Edit info and cover photo",
    value: MenuItem.EditInfo,
  },
  {
    text: (
      <>
        <AgendaIcon className="edit-common-menu__item-icon" /> Edit rules
      </>
    ),
    searchText: "Edit rules",
    value: MenuItem.EditRules,
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
];

interface CommonMenuProps {
  className?: string;
  menuButtonClassName?: string;
  common: Common;
  withBorder?: boolean;
  onMenuItemClick: (menuItem: MenuItem) => void;
}

const CommonMenu: FC<CommonMenuProps> = (props) => {
  const {
    className,
    menuButtonClassName,
    common,
    onMenuItemClick,
    withBorder = false,
  } = props;
  const dropdownRef = useRef<DropdownRef>(null);
  const screenSize = useSelector(getScreenSize());
  const user = useSelector(selectUser());
  const {
    isShowing: isModalMenuShowing,
    onOpen: onMenuModalOpen,
    onClose: onMenuModalClose,
  } = useModal(false);
  const isMobileView = screenSize === ScreenSize.Mobile;
  const commonMember = common?.members.find(
    (member) => member.userId === user?.uid
  );
  const isCommonOwner = Boolean(
    commonMember?.permission === MemberPermission.Founder
  );
  const menuItems = useMemo<MenuItem[]>(() => {
    const items: MenuItem[] = [
      MenuItem.EditInfo,
      MenuItem.EditRules,
      MenuItem.MyContributions,
    ];

    if (isCommonOwner && common.members.length === 1) {
      items.push(MenuItem.DeleteCommon);
    }

    return items;
  }, [isCommonOwner, common.members]);
  const options = useMemo(
    () =>
      OPTIONS.filter((option) => menuItems.includes(option.value as MenuItem)),
    [menuItems]
  );

  const handleSelect = (value: unknown) => {
    onMenuItemClick(value as MenuItem);
  };

  const buttonElement = (
    <ButtonIcon
      className={classNames(
        "edit-common-menu__menu-button",
        menuButtonClassName,
        {
          "edit-common-menu__menu-button--with-border": withBorder,
        }
      )}
      onClick={isMobileView ? onMenuModalOpen : undefined}
    >
      <MenuIcon className="edit-common-menu__menu-button-icon" />
    </ButtonIcon>
  );

  const renderMenuDropdown = () => (
    <Dropdown
      ref={dropdownRef}
      options={options}
      onSelect={handleSelect}
      shouldBeFixed={false}
      menuButton={buttonElement}
      styles={{
        menu: "edit-common-menu__dropdown-menu",
        menuList: "edit-common-menu__dropdown-menu-list",
        menuItem: "edit-common-menu__dropdown-menu-item",
      }}
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
                  option.className
                )}
                onClick={() => handleSelect(option.value)}
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
    </div>
  );
};

export default CommonMenu;
