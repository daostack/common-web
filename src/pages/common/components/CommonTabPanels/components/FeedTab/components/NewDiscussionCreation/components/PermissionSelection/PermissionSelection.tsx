import React, { FC } from "react";
import { LeftArrowIcon } from "@/shared/icons";
import { MenuItem } from "@/shared/interfaces";
import { Circle, Governance } from "@/shared/models";
import { DesktopMenu } from "@/shared/ui-kit";
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

  const circleOptions: MenuItem[] = Object.values(governanceCircles)
    .filter((circle) => userCircleIds?.includes(circle.id))
    .map((circle) => ({
      id: `${Permission.Private}_${circle.id}`,
      text: `${circle.name}s`,
      onClick: () => onCircleSave(circle),
    }));

  const items: MenuItem[] = [
    {
      id: Permission.Public,
      text: "Public",
      onClick: () => onCircleSave(null),
    },
    ...circleOptions,
  ];
  const buttonEl = (
    <button className={styles.button} type="button" disabled={disabled}>
      {!currentCircle ? "Public" : `${currentCircle.name}s`}
      <LeftArrowIcon className={styles.arrowIcon} />
    </button>
  );

  return (
    <DesktopMenu
      menuItemsClassName={styles.desktopMenuItems}
      triggerEl={buttonEl}
      items={items}
    />
  );
};

export default PermissionSelection;
