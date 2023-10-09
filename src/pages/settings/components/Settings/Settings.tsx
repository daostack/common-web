import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { selectUser } from "@/pages/Auth/store/selectors";
import { Loader } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { useGoBack, useModal } from "@/shared/hooks";
import { getScreenSize } from "@/shared/store/selectors";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { Header, SettingsForm } from "./components";
import styles from "./Settings.module.scss";

export default function Settings() {
  const history = useHistory();
  const { canGoBack, goBack } = useGoBack();
  const { getProfilePagePath } = useRoutesContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    isShowing: isDeleteAccountModalShowing,
    onOpen: onDeleteAccountModalOpen,
    onClose: onDeleteAccountModalClose,
  } = useModal(false);
  const user = useSelector(selectUser());
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleGoBack = () => {
    if (canGoBack) {
      goBack();
    } else {
      history.push(getProfilePagePath());
    }
  };

  const handleSubmit = () => {
    // userDetailsRef.current?.submit();
  };

  const buttonsWrapperEl = (
    <div className="profile-wrapper__buttons-wrapper">
      <Button
        className="profile-wrapper__button"
        variant={ButtonVariant.OutlineDarkPink}
        onClick={handleCancelClick}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        variant={ButtonVariant.PrimaryPink}
        className="profile-wrapper__button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        Save
      </Button>
    </div>
  );

  return (
    <div className={styles.container}>
      <Header className={styles.header} />
      {!user && <Loader />}
      {user && (
        <SettingsForm
          withoutPushNotifications={
            !user.fcmTokens || user.fcmTokens.length === 0
          }
          onSave={handleGoBack}
          onCancel={handleGoBack}
        />
      )}
      {/*<DeleteUserModal*/}
      {/*  isShowing={isDeleteAccountModalShowing}*/}
      {/*  onClose={onDeleteAccountModalClose}*/}
      {/*/>*/}
    </div>
  );
}
