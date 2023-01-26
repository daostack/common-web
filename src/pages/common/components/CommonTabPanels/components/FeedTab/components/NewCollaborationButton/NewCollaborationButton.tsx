import React, { FC } from "react";
import { BoldPlusIcon } from "@/shared/icons";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import {
  Button,
  ButtonIcon,
  ButtonSize,
  ButtonVariant,
  DesktopMenu,
  MobileMenu,
} from "@/shared/ui-kit";
import { useMenuItems } from "./hooks";
import styles from "./NewCollaborationButton.module.scss";

interface NewCollaborationButtonProps {
  isMobileVersion?: boolean;
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Pick<Governance, "circles">;
}

const NewCollaborationButton: FC<NewCollaborationButtonProps> = (props) => {
  const { isMobileVersion = false, commonMember, governance } = props;
  const items = useMenuItems({ commonMember, governance });
  const buttonVariant = ButtonVariant.OutlineBlue;
  const iconEl = <BoldPlusIcon className={styles.icon} />;

  if (items.length === 0) {
    return null;
  }

  if (!isMobileVersion) {
    return (
      <DesktopMenu
        triggerEl={
          <Button
            variant={buttonVariant}
            size={ButtonSize.Xsmall}
            leftIcon={iconEl}
          >
            New Collaboration
          </Button>
        }
        items={items}
      />
    );
  }

  return (
    <MobileMenu
      triggerEl={<ButtonIcon variant={buttonVariant}>{iconEl}</ButtonIcon>}
      items={items}
    />
  );
};

export default NewCollaborationButton;
