import React, { FC, useMemo, useState } from "react";
import { DropdownOption, ElementDropdownMenuItems } from "@/shared/components";
import {
  MenuItem as DesktopStyleMenuItem,
  MenuItemType,
} from "@/shared/interfaces";
import { DesktopStyleMenu } from "@/shared/ui-kit";
import elementDropdownStyles from "./MemberDropdown.module.scss";

interface MemberDropdownProps {
  isOpen: boolean;
  onMenuToggle: (isOpen: boolean) => void;
}

const MemberDropdown: FC<MemberDropdownProps> = (props) => {
  const { isOpen, onMenuToggle } = props;
  const [selectedItem, setSelectedItem] = useState<
    ElementDropdownMenuItems | unknown
  >(null);

  const ElementDropdownMenuItemsList: DropdownOption[] = useMemo(() => {
    const items: DropdownOption[] = [];

    // TODO: check and push the right circles.

    items.push({
      text: <span>Assign</span>,
      value: "Assign",
    });

    return items;
  }, []);

  const desktopStyleMenuItems = useMemo<DesktopStyleMenuItem[]>(
    () =>
      ElementDropdownMenuItemsList.map<DesktopStyleMenuItem>((item) => ({
        type: MenuItemType.Button,
        id: item.value as string,
        className: item.className,
        text: item.text,
        onClick: () => {
          setSelectedItem(item.value);
          onMenuToggle(false);
        },
      })),
    [ElementDropdownMenuItemsList, setSelectedItem, selectedItem],
  );

  return (
    <>
      <DesktopStyleMenu
        className={elementDropdownStyles.desktopStyleMenu}
        isOpen={isOpen}
        onClose={() => onMenuToggle(false)}
        items={desktopStyleMenuItems}
        withTransition={false}
      />
    </>
  );
};

export default MemberDropdown;
