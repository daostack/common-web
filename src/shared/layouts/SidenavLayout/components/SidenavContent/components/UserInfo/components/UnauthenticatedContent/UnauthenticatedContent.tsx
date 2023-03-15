import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { setLoginModalState } from "@/pages/Auth/store/actions";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { Button, ButtonSize, ButtonVariant } from "@/shared/ui-kit/Button";
import { Content, ContentStyles } from "../Content";
import styles from "./UnauthenticatedContent.module.scss";

interface UnauthenticatedContentProps {
  contentStyles?: ContentStyles;
}

const UnauthenticatedContent: FC<UnauthenticatedContentProps> = (props) => {
  const { contentStyles } = props;
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(setLoginModalState({ isShowing: true }));
  };

  return (
    <Content
      avatarURL={avatarPlaceholderSrc}
      userName="Guest"
      as="div"
      leftSideEl={
        <Button
          className={styles.loginButton}
          variant={ButtonVariant.OutlineBlue}
          size={ButtonSize.Xsmall}
          onClick={handleLogin}
        >
          Login
        </Button>
      }
      styles={contentStyles}
    />
  );
};

export default UnauthenticatedContent;
