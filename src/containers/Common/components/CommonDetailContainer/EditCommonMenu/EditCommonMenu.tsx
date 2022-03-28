import React, { useMemo, FC } from "react";
import classNames from "classnames";
import { ButtonIcon, Dropdown, DropdownOption } from "@/shared/components";
import AgendaIcon from "@/shared/icons/agenda.icon";
import ContributionIcon from "@/shared/icons/contribution.icon";
import MenuIcon from "@/shared/icons/menu.icon";
import MosaicIcon from "@/shared/icons/mosaic.icon";
import TrashIcon from "@/shared/icons/trash.icon";
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
    className: "edit-common-menu__menu-item--red",
  },
];

interface EditCommonMenuProps {
  className?: string;
  menuButtonClassName?: string;
  isCommonDeletionAvailable: boolean;
  withBorder?: boolean;
  onMenuItemClick: (menuItem: MenuItem) => void;
}

const EditCommonMenu: FC<EditCommonMenuProps> = (props) => {
  const {
    className,
    menuButtonClassName,
    isCommonDeletionAvailable,
    onMenuItemClick,
    withBorder = false,
  } = props;
  const options = useMemo(
    () =>
      OPTIONS.filter(
        (option) =>
          option.value !== MenuItem.DeleteCommon || isCommonDeletionAvailable
      ),
    [isCommonDeletionAvailable]
  );

  const handleSelect = (value: unknown) => {
    onMenuItemClick(value as MenuItem);
  };

  return (
    <Dropdown
      className={classNames("edit-common-menu", className)}
      options={options}
      onSelect={handleSelect}
      shouldBeFixed={false}
      menuButton={
        <ButtonIcon
          className={classNames(
            "edit-common-menu__menu-button",
            menuButtonClassName,
            {
              "edit-common-menu__menu-button--with-border": withBorder,
            }
          )}
        >
          <MenuIcon className="edit-common-menu__menu-button-icon" />
        </ButtonIcon>
      }
      styles={{
        menu: "edit-common-menu__menu",
        menuList: "edit-common-menu__menu-list",
        menuItem: "edit-common-menu__menu-item",
      }}
    />
  );
};

export default EditCommonMenu;
