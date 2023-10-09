import React, { FC } from "react";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { MoreIcon } from "@/shared/icons";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { DesktopMenu, MobileMenu } from "@/shared/ui-kit";
import { useJoinProjectAutomatically } from "../../hooks";
import { useCommonDataContext } from "../../providers";
import { useMenuItems } from "./hooks";
import styles from "./CommonMenuButton.module.scss";

interface Styles {
  container?: string;
  button?: string;
  menuItems?: string;
}

interface CommonMenuButtonProps {
  commonMember: (CommonMember & CirclesPermissions) | null;
  circles: Governance["circles"];
  isSubCommon: boolean;
  isMobileVersion?: boolean;
  styles?: Styles;
}

const CommonMenuButton: FC<CommonMenuButtonProps> = (props) => {
  const {
    commonMember,
    circles,
    isSubCommon,
    isMobileVersion = false,
    styles: outerStyles,
  } = props;

  const { parentCommon, common } = useCommonDataContext();

  const { canJoinProjectAutomatically } = useJoinProjectAutomatically(
    commonMember,
    common,
    parentCommon,
  );

  const items = useMenuItems({
    commonMember,
    isSubCommon,
    governance: { circles },
    canLeaveSpace: !canJoinProjectAutomatically,
  });

  if (items.length === 0) {
    return null;
  }

  const buttonEl = (
    <ButtonIcon className={outerStyles?.button}>
      <MoreIcon className={styles.icon} />
    </ButtonIcon>
  );

  if (!isMobileVersion) {
    return (
      <DesktopMenu
        className={outerStyles?.container}
        menuItemsClassName={outerStyles?.menuItems}
        triggerEl={buttonEl}
        items={items}
      />
    );
  }

  return (
    <MobileMenu
      className={outerStyles?.container}
      triggerEl={buttonEl}
      items={items}
    />
  );
};

export default CommonMenuButton;
