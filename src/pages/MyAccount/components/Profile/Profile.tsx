import React, { FC, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { matchPath, useLocation } from "react-router";
import { logOut } from "@/pages/Auth/store/actions";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ButtonIcon, Loader } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Edit3Icon as EditIcon, LogoutIcon } from "@/shared/icons";
import ThemeIcon from "@/shared/icons/theme.icon";
import { toggleTheme } from "@/shared/store/actions";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { Header, MenuButton, UserDetails, UserDetailsRef } from "./components";
import styles from "./Profile.module.scss";

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
  const { pathname } = useLocation();
  const isV04 = matchPath(ROUTE_PATHS.V04_PROFILE, pathname);

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

  const handleThemeToggle = () => {
    dispatch(toggleTheme(null));
  };

  const handleLogout = () => {
    dispatch(logOut());
  };

  const buttonsWrapperEl = (
    <div className={styles.buttonsWrapper}>
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
        {isMobileView ? "Save changes" : "Save"}
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
      <div className={styles.content}>
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
                className={styles.userDetails}
                user={user}
                isCountryDropdownFixed={false}
                isEditing={isEditing}
                isMobileView={isMobileView}
                onEdit={handleEditClick}
                onLoading={setIsSubmitting}
                onSubmitting={handleSubmittingChange}
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
                {!isV04 && (
                  <MenuButton
                    className={`${styles.menuButton} ${styles.themeMenuButton}`}
                    text="Light/Dark mode"
                    onClick={handleThemeToggle}
                    iconEl={<ThemeIcon />}
                  />
                )}
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
