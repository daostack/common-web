import React, { FC } from "react";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { Button, ButtonSize, ButtonVariant } from "@/shared/ui-kit/Button";
import { Content } from "../Content";
import styles from "./UnauthenticatedContent.module.scss";

const UnauthenticatedContent: FC = () => (
  <Content
    avatarURL={avatarPlaceholderSrc}
    userName="Guest"
    as="div"
    leftSideEl={
      <Button
        className={styles.loginButton}
        variant={ButtonVariant.OutlineBlue}
        size={ButtonSize.Xsmall}
      >
        Login
      </Button>
    }
  />
);

export default UnauthenticatedContent;
