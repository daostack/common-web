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
import styles from "./NewStreamButton.module.scss";

interface NewStreamButtonProps {
  className?: string;
  isMobileVersion?: boolean;
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Pick<Governance, "circles">;
}

const NewStreamButton: FC<NewStreamButtonProps> = (props) => {
  const {
    className,
    isMobileVersion = false,
    commonMember,
    governance,
  } = props;
  const items = useMenuItems({ commonMember, governance });
  const buttonVariant = ButtonVariant.OutlinePink;
  const iconEl = <BoldPlusIcon className={styles.icon} />;

  if (items.length === 0) {
    return null;
  }

  if (!isMobileVersion) {
    return (
      <DesktopMenu
        className={className}
        triggerEl={
          <Button
            variant={buttonVariant}
            size={ButtonSize.Xsmall}
            leftIcon={iconEl}
          >
            New stream
          </Button>
        }
        items={items}
      />
    );
  }

  return (
    <MobileMenu
      className={className}
      triggerEl={<ButtonIcon variant={buttonVariant}>{iconEl}</ButtonIcon>}
      items={items}
    />
  );
};

export default NewStreamButton;
