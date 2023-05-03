import React, { FC, useMemo, useState } from "react";
import { DropdownOption } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import {
  MenuItem as DesktopStyleMenuItem,
  MenuItemType,
} from "@/shared/interfaces";
import { Circle } from "@/shared/models";
import { DesktopStyleMenu } from "@/shared/ui-kit";
import AssignCircleModal from "./AssignCircleModal";
import elementDropdownStyles from "./MemberDropdown.module.scss";

interface MemberDropdownProps {
  isOpen: boolean;
  onMenuToggle: (isOpen: boolean) => void;
  notMemberCircles: Circle[];
}

const MemberDropdown: FC<MemberDropdownProps> = (props) => {
  const { isOpen, onMenuToggle, notMemberCircles } = props;
  const { isShowing, onClose, onOpen } = useModal(false);
  const [selectedCircleId, setSelectedCircleId] = useState<string>();

  console.log(selectedCircleId);

  const ElementDropdownMenuItemsList: DropdownOption[] = useMemo(() => {
    // INVITE_TO_CIRCLE --> CREATE AS AN ACTION
    const items: DropdownOption[] = notMemberCircles.map((circle) => ({
      text: <span>Add to {circle.name}</span>,
      value: circle.id,
    }));

    return items;
  }, [notMemberCircles]);

  const desktopStyleMenuItems = useMemo<DesktopStyleMenuItem[]>(
    () =>
      ElementDropdownMenuItemsList.map<DesktopStyleMenuItem>((item) => ({
        type: MenuItemType.Button,
        id: item.value as string,
        className: item.className,
        text: item.text,
        onClick: () => {
          setSelectedCircleId(item.value as string);
          onOpen();
          onMenuToggle(false);
        },
      })),
    [ElementDropdownMenuItemsList, setSelectedCircleId, onOpen],
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
      <AssignCircleModal isShowing={isShowing} onClose={onClose} />
    </>
  );
};

export default MemberDropdown;
