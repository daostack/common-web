import React, { FC, useMemo, useState } from "react";
import { InboxAction } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import { MenuItem as Item } from "@/shared/interfaces";
import { DesktopMenu, MobileMenu } from "@/shared/ui-kit";
import { DirectMessageModal } from "../DirectMessageButton/components";
import { PlusButton } from "../HeaderContent/components";

interface NewDirectMessageButton {
  isMobileVersion?: boolean;
  className?: string;
}

const NewDirectMessageButton: FC<NewDirectMessageButton> = (props) => {
  const { isMobileVersion, className } = props;
  const {
    isShowing: isDirectMessageModalOpen,
    onOpen: onDirectMessageModalOpen,
    onClose: onDirectMessageModalClose,
  } = useModal(false);
  const [groupMessage, setGroupMessage] = useState(false);

  const items: Item[] = useMemo(
    () => [
      {
        id: InboxAction.NewDirectMessage,
        text: "Direct message",
        onClick: () => {
          setGroupMessage(false);
          onDirectMessageModalOpen();
        },
      },
      {
        id: InboxAction.NewGroupMessage,
        text: "Group message",
        onClick: () => {
          setGroupMessage(true);
          onDirectMessageModalOpen();
        },
      },
    ],
    [groupMessage],
  );

  const triggerEl = <PlusButton />;
  const menuProps = {
    className,
    triggerEl,
    items,
  };
  const Menu = isMobileVersion ? MobileMenu : DesktopMenu;

  return (
    <>
      <Menu {...menuProps} />
      <DirectMessageModal
        isOpen={isDirectMessageModalOpen}
        onClose={onDirectMessageModalClose}
        isMobileVersion={isMobileVersion}
        groupMessage={groupMessage}
      />
    </>
  );
};

export default NewDirectMessageButton;
