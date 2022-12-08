import React, { FC } from "react";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { MoreIcon } from "@/shared/icons";
import { DesktopMenuButton } from "./components";
import styles from "./CommonMenuButton.module.scss";

interface Styles {
  container?: string;
  button?: string;
}

interface CommonMenuButtonProps {
  isMobileVersion?: boolean;
  styles?: Styles;
}

const CommonMenuButton: FC<CommonMenuButtonProps> = (props) => {
  const { isMobileVersion = false, styles: outerStyles } = props;
  const buttonEl = (
    <ButtonIcon className={outerStyles?.button}>
      <MoreIcon className={styles.icon} />
    </ButtonIcon>
  );

  if (!isMobileVersion) {
    return (
      <DesktopMenuButton
        className={outerStyles?.container}
        triggerEl={buttonEl}
        items={[]}
      />
    );
  }

  return buttonEl;
};

export default CommonMenuButton;
