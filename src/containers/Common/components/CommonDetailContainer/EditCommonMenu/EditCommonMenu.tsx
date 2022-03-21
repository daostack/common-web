import React, { FC } from "react";
import { Dropdown, DropdownOption } from "@/shared/components";
import AgendaIcon from "@/shared/icons/agenda.icon";
import ContributionIcon from "@/shared/icons/contribution.icon";
import MenuIcon from "@/shared/icons/menu.icon";
import MosaicIcon from "@/shared/icons/mosaic.icon";
import TrashIcon from "@/shared/icons/trash.icon";
import "./index.scss";

enum MenuItem {
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

const EditCommonMenu: FC = () => {
  const handleSelect = (value: unknown) => {
    console.log(value as MenuItem);
  };

  return (
    <Dropdown
      className="edit-common-menu"
      options={OPTIONS}
      onSelect={handleSelect}
      shouldBeFixed={false}
      styles={{
        menu: "edit-common-menu__menu",
        menuList: "edit-common-menu__menu-list",
        menuItem: "edit-common-menu__menu-item",
      }}
    />
  );
};

export default EditCommonMenu;
