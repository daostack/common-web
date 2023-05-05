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
  memberName: string;
  commonId: string;
  memberId: string;
}

export interface SelectedCircle {
  id: string;
  name: string;
}

const MemberDropdown: FC<MemberDropdownProps> = (props) => {
  const {
    isOpen,
    onMenuToggle,
    notMemberCircles,
    memberName,
    commonId,
    memberId,
  } = props;
  const { isShowing, onClose, onOpen } = useModal(false);
  const [selectedCircle, setSelectedCircle] = useState<SelectedCircle>();

  const ElementDropdownMenuItemsList: DropdownOption[] = useMemo(() => {
    const items: DropdownOption[] = notMemberCircles.map((circle) => ({
      text: `Add to ${circle.name}`,
      value: {
        id: circle.id,
        name: circle.name,
      },
      className: elementDropdownStyles.dropdownItem,
    }));

    return items;
  }, [notMemberCircles]);

  const desktopStyleMenuItems = useMemo<DesktopStyleMenuItem[]>(
    () =>
      ElementDropdownMenuItemsList.map<DesktopStyleMenuItem>((item) => ({
        type: MenuItemType.Button,
        id: (item.value as SelectedCircle).id,
        className: item.className,
        text: item.text,
        onClick: () => {
          setSelectedCircle(item.value as SelectedCircle);
          onOpen();
        },
      })),
    [ElementDropdownMenuItemsList, setSelectedCircle, onOpen],
  );

  return (
    <>
      <DesktopStyleMenu
        className={elementDropdownStyles.desktopStyleMenu}
        isOpen={isOpen}
        onClose={() => !isShowing && onMenuToggle(false)}
        items={desktopStyleMenuItems}
        withTransition={false}
      />
      <AssignCircleModal
        isShowing={isShowing}
        onClose={onClose}
        selectedCircle={selectedCircle}
        memberName={memberName}
        onMenuToggle={onMenuToggle}
        commonId={commonId}
        memberId={memberId}
      />
    </>
  );
};

export default MemberDropdown;
