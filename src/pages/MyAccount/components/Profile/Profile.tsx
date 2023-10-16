import React, { FC, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/pages/Auth/store/actions";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  UserDetails,
  UserDetailsRef,
} from "@/pages/Login/components/LoginContainer/UserDetails";
import { ButtonIcon, Loader } from "@/shared/components";
import { useRoutesContext } from "@/shared/contexts";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Edit3Icon as EditIcon, LogoutIcon } from "@/shared/icons";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { Header, MenuButton } from "./components";
import styles from "./Profile.module.scss";
import "./index.scss";

interface ProfileProps {
  onEditingChange?: (isEditing: boolean) => void;
}

const Profile: FC<ProfileProps> = (props) => {
  const { onEditingChange } = props;
  const dispatch = useDispatch();
  const { getBillingPagePath, getSettingsPagePath } = useRoutesContext();
  const userDetailsRef = useRef<UserDetailsRef>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector(selectUser());
  const isMobileView = useIsTabletView();

  const handleEditingChange = (isEditing: boolean) => {
    setIsEditing(isEditing);
    onEditingChange?.(isEditing);
  };

  const handleEditClick = () => {
    handleEditingChange(true);
  };

  const handleCancelClick = () => {
    handleEditingChange(false);
  };

  const handleSubmittingChange = (isSubmitting: boolean) => {
    if (!isSubmitting) {
      handleEditingChange(false);
    }

    setIsSubmitting(isSubmitting);
  };

  const handleSubmit = () => {
    userDetailsRef.current?.submit();
  };

  const handleLogout = () => {
    dispatch(logOut());
  };

  const buttonsWrapperEl = (
    <div className="profile-wrapper__buttons-wrapper">
      <Button
        variant={ButtonVariant.OutlineDarkPink}
        onClick={handleCancelClick}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        variant={ButtonVariant.PrimaryPink}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        Save
      </Button>
    </div>
  );
  const editButtonEl = (
    <ButtonIcon className={styles.editButton} onClick={handleEditClick}>
      <EditIcon />
    </ButtonIcon>
  );

  return (
    <div className={styles.container}>
      {!isMobileView && !isEditing && editButtonEl}
      <div className="profile-wrapper">
        <Header
          className={styles.header}
          isEditing={isEditing}
          isMobileVersion={isMobileView}
          editButtonEl={editButtonEl}
        />
        {!user && <Loader />}
        {user && (
          <>
            <div className={styles.formWrapper}>
              <UserDetails
                ref={userDetailsRef}
                className="profile-wrapper__user-details"
                user={user}
                showAuthProvider={false}
                customSaveButton
                isCountryDropdownFixed={false}
                isEditing={isEditing}
                onLoading={setIsSubmitting}
                onSubmitting={handleSubmittingChange}
                styles={{
                  avatarWrapper: "profile-wrapper__avatar-wrapper",
                  avatar: "profile-wrapper__avatar",
                  userAvatar: "profile-wrapper__user-avatar",
                  editAvatar: "profile-wrapper__edit-avatar",
                  fieldContainer: "profile-wrapper__field-container",
                  introInputWrapper:
                    "profile-wrapper__form-intro-input-wrapper",
                }}
              />
              {isEditing && buttonsWrapperEl}
            </div>
            {isMobileView && !isEditing && (
              <div className={styles.menuButtonsWrapper}>
                <MenuButton
                  className={styles.menuButton}
                  text="Settings"
                  to={getSettingsPagePath()}
                />
                <MenuButton
                  className={styles.menuButton}
                  text="Billing"
                  to={getBillingPagePath()}
                />
                <MenuButton
                  className={`${styles.menuButton} ${styles.logoutMenuButton}`}
                  text="Logout"
                  onClick={handleLogout}
                  iconEl={<LogoutIcon />}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
