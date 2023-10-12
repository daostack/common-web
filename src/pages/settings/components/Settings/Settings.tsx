import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { selectUser } from "@/pages/Auth/store/selectors";
import { DeleteUserModal } from "@/pages/MyAccount/components/Profile";
import { Loader } from "@/shared/components";
import { useRoutesContext } from "@/shared/contexts";
import { useGoBack, useModal, useNotification } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Header, SettingsForm, SettingsMenuButton } from "./components";
import styles from "./Settings.module.scss";

export default function Settings() {
  const history = useHistory();
  const { canGoBack, goBack } = useGoBack();
  const { getProfilePagePath } = useRoutesContext();
  const { notify } = useNotification();
  const isMobileView = useIsTabletView();
  const {
    isShowing: isDeleteAccountModalShowing,
    onOpen: onDeleteAccountModalOpen,
    onClose: onDeleteAccountModalClose,
  } = useModal(false);
  const user = useSelector(selectUser());

  const handleGoBack = () => {
    if (canGoBack) {
      goBack();
    } else {
      history.push(getProfilePagePath());
    }
  };

  const handleSave = (withoutCall?: boolean) => {
    if (!withoutCall) {
      notify("Settings were successfully updated");
    }
    handleGoBack();
  };

  return (
    <div className={styles.container}>
      {!isMobileView && (
        <SettingsMenuButton
          styles={{ container: styles.settingsMenuButton }}
          isMobileVersion={false}
          onAccountDelete={onDeleteAccountModalOpen}
        />
      )}
      <div className={styles.content}>
        <Header
          className={styles.header}
          isMobileVersion={isMobileView}
          onAccountDelete={onDeleteAccountModalOpen}
        />
        {!user && <Loader />}
        {user && (
          <SettingsForm
            className={styles.settingsForm}
            withoutPushNotifications={
              !user.fcmTokens || user.fcmTokens.length === 0
            }
            onSave={handleSave}
            onCancel={handleGoBack}
          />
        )}
        <DeleteUserModal
          isShowing={isDeleteAccountModalShowing}
          onClose={onDeleteAccountModalClose}
        />
      </div>
    </div>
  );
}
