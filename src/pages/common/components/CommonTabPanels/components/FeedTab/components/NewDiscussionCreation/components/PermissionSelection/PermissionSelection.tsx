import React, { FC, useState } from "react";
import { useModal } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { LeftArrowIcon } from "@/shared/icons";
import { MenuItem } from "@/shared/interfaces";
import { Circle, Governance } from "@/shared/models";
import { DesktopMenu, MobileMenu } from "@/shared/ui-kit";
import { CircleSelectionModal } from "../CircleSelectionModal";
import { Permission } from "./constants";
import styles from "./PermissionSelection.module.scss";

interface PermissionSelectionProps {
  governanceCircles: Governance["circles"];
  userCircleIds?: string[];
}

const PermissionSelection: FC<PermissionSelectionProps> = (props) => {
  const { governanceCircles, userCircleIds } = props;
  const {
    isShowing: isCircleSelectionModalOpen,
    onOpen: onCircleSelectionModalOpen,
    onClose: onCircleSelectionModalClose,
  } = useModal(false);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const isTabletView = useIsTabletView();
  const items: MenuItem[] = [
    {
      id: Permission.Public,
      text: "Public discussion",
      onClick: () => {
        setSelectedCircle(null);
      },
    },
    {
      id: Permission.Private,
      text: "Private to a circle",
      onClick: onCircleSelectionModalOpen,
    },
  ];
  const buttonEl = (
    <button className={styles.button}>
      {!selectedCircle ? "Public" : `Private: ${selectedCircle.name}`}
      <LeftArrowIcon className={styles.arrowIcon} />
    </button>
  );
  const menuEl = isTabletView ? (
    <MobileMenu triggerEl={buttonEl} items={items} />
  ) : (
    <DesktopMenu
      menuItemsClassName={styles.desktopMenuItem}
      triggerEl={buttonEl}
      items={items}
    />
  );

  return (
    <>
      {menuEl}
      <CircleSelectionModal
        isOpen={isCircleSelectionModalOpen}
        onClose={onCircleSelectionModalClose}
        onSave={setSelectedCircle}
        initialCircleId={selectedCircle?.id}
        governanceCircles={governanceCircles}
        userCircleIds={userCircleIds}
      />
    </>
  );
};

export default PermissionSelection;
