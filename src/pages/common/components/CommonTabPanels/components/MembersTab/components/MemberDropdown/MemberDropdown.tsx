import React, { FC, useMemo, useState } from "react";
import { DropdownOption } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { MenuItemType } from "@/shared/interfaces";
import { ContextMenuItem as Item } from "@/shared/interfaces";
import { Circle } from "@/shared/models";
import { ContextMenu, ContextMenuRef } from "@/shared/ui-kit";
import AssignCircleModal from "./AssignCircleModal";
import elementDropdownStyles from "./MemberDropdown.module.scss";

interface MemberDropdownProps {
  notMemberCircles: Circle[];
  memberName: string;
  commonId: string;
  memberId: string;
  contextMenuRef: React.RefObject<ContextMenuRef>;
}

export interface SelectedCircle {
  id: string;
  name: string;
}

const MemberDropdown: FC<MemberDropdownProps> = (props) => {
  const { notMemberCircles, memberName, commonId, memberId, contextMenuRef } =
    props;
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

  const menuItems = useMemo<Item[]>(
    () =>
      ElementDropdownMenuItemsList.map<Item>((item) => ({
        type: MenuItemType.Button,
        id: (item.value as SelectedCircle).id,
        className: item.className,
        text: (item.value as SelectedCircle).name,
        onClick: () => {
          setSelectedCircle(item.value as SelectedCircle);
          onOpen();
        },
      })),
    [ElementDropdownMenuItemsList, setSelectedCircle, onOpen],
  );

  return (
    <>
      <ContextMenu ref={contextMenuRef} menuItems={menuItems} />

      <AssignCircleModal
        isShowing={isShowing}
        onClose={onClose}
        selectedCircle={selectedCircle}
        memberName={memberName}
        commonId={commonId}
        memberId={memberId}
      />
    </>
  );
};

export default MemberDropdown;
