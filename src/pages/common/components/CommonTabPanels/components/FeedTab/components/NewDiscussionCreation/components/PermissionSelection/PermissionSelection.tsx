import React, { FC } from "react";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { LeftArrowIcon } from "@/shared/icons";
import { MenuItem } from "@/shared/interfaces";
import { DesktopMenu, MobileMenu } from "@/shared/ui-kit";
import { Permission } from "./constants";
import styles from "./PermissionSelection.module.scss";

const PermissionSelection: FC = () => {
  const isTabletView = useIsTabletView();
  const items: MenuItem[] = [
    {
      id: Permission.Public,
      text: "Public discussion",
      onClick: () => {
        console.log("Public discussion");
      },
    },
    {
      id: Permission.Private,
      text: "Private to a circle",
      onClick: () => {
        console.log("Private to a circle");
      },
    },
  ];
  const buttonEl = (
    <button className={styles.button}>
      Public
      <LeftArrowIcon className={styles.arrowIcon} />
    </button>
  );

  if (!isTabletView) {
    return (
      <DesktopMenu
        menuItemsClassName={styles.desktopMenuItem}
        triggerEl={buttonEl}
        items={items}
      />
    );
  }

  return <MobileMenu triggerEl={buttonEl} items={items} />;
};

export default PermissionSelection;
