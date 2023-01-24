import React, { FC } from "react";
import { useModal } from "@/shared/hooks";
import { LeftArrowIcon } from "@/shared/icons";
import { MenuItem } from "@/shared/interfaces";
import { Circle, Governance } from "@/shared/models";
import { DesktopMenu } from "@/shared/ui-kit";
import { CircleSelectionModal } from "../CircleSelectionModal";
import { Permission } from "./constants";
import styles from "./PermissionSelection.module.scss";

interface PermissionSelectionProps {
  currentCircle: Circle | null;
  governanceCircles: Governance["circles"];
  userCircleIds?: string[];
  onCircleSave: (circle: Circle | null) => void;
  disabled?: boolean;
}

const PermissionSelection: FC<PermissionSelectionProps> = (props) => {
  const {
    currentCircle,
    governanceCircles,
    userCircleIds,
    onCircleSave,
    disabled,
  } = props;
  const {
    isShowing: isCircleSelectionModalOpen,
    onOpen: onCircleSelectionModalOpen,
    onClose: onCircleSelectionModalClose,
  } = useModal(false);
  const items: MenuItem[] = [
    {
      id: Permission.Public,
      text: "Public discussion",
      onClick: () => {
        onCircleSave(null);
      },
    },
    {
      id: Permission.Private,
      text: "Private to a circle",
      onClick: onCircleSelectionModalOpen,
    },
  ];
  const buttonEl = (
    <button className={styles.button} type="button" disabled={disabled}>
      {!currentCircle ? "Public" : `Private: ${currentCircle.name}`}
      <LeftArrowIcon className={styles.arrowIcon} />
    </button>
  );

  return (
    <>
      <DesktopMenu
        menuItemsClassName={styles.desktopMenuItems}
        triggerEl={buttonEl}
        items={items}
      />
      <CircleSelectionModal
        isOpen={isCircleSelectionModalOpen}
        onClose={onCircleSelectionModalClose}
        onSave={onCircleSave}
        initialCircleId={currentCircle?.id}
        governanceCircles={governanceCircles}
        userCircleIds={userCircleIds}
      />
    </>
  );
};

export default PermissionSelection;
