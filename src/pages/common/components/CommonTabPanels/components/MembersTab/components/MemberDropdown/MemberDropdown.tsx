import React, { FC, useMemo, useState } from "react";
import { useModal } from "@/shared/hooks";
import { ContextMenuItem as Item } from "@/shared/interfaces";
import { Circle } from "@/shared/models";
import { ContextMenu, ContextMenuRef } from "@/shared/ui-kit";
import { pluralizeWord } from "@/shared/utils";
import AssignCircleModal from "./AssignCircleModal";

interface MemberDropdownProps {
  notMemberCircles: Circle[];
  memberName: string;
  commonId: string;
  memberId: string;
  contextMenuRef: React.RefObject<ContextMenuRef>;
  isProject: boolean;
}

const MemberDropdown: FC<MemberDropdownProps> = (props) => {
  const {
    notMemberCircles,
    memberName,
    commonId,
    memberId,
    contextMenuRef,
    isProject,
  } = props;
  const { isShowing, onClose, onOpen } = useModal(false);
  const [selectedCircle, setSelectedCircle] = useState<Circle>();

  const menuItems = useMemo<Item[]>(
    () =>
      notMemberCircles.map((circle) => ({
        id: circle.id,
        text: `Add to ${pluralizeWord(circle.name)}`,
        onClick: () => {
          setSelectedCircle(circle);
          onOpen();
        },
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
        isProject={isProject}
      />
    </>
  );
};

export default MemberDropdown;
