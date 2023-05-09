import React, { FC, useMemo, useState } from "react";
import { useModal } from "@/shared/hooks";
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

  const menuItems = useMemo<Item[]>(
    () =>
      notMemberCircles.map((circle) => ({
        id: circle.id,
        text: `Add to ${circle.name}`,
        onClick: () => {
          setSelectedCircle({ id: circle.id, name: circle.name });
          onOpen();
        },
        className: elementDropdownStyles.dropdownItem,
      })),
    [notMemberCircles, setSelectedCircle, onOpen],
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
