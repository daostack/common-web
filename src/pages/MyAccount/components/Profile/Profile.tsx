import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  UserDetails,
  UserDetailsRef,
} from "@/pages/Login/components/LoginContainer/UserDetails";
import { Loader } from "@/shared/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { Header } from "./components";
import styles from "./Profile.module.scss";
import "./index.scss";

export default function Profile() {
  const userDetailsRef = useRef<UserDetailsRef>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector(selectUser());
  const isMobileView = useIsTabletView();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSubmittingChange = (isSubmitting: boolean) => {
    if (!isSubmitting) {
      setIsEditing(false);
    }

    setIsSubmitting(isSubmitting);
  };

  const handleSubmit = () => {
    userDetailsRef.current?.submit();
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
    <div className="route-content profile-wrapper">
      <Header
        className={styles.header}
        isEditing={isEditing}
        isMobileVersion={isMobileView}
      />
      {!user ? (
        <Loader />
      ) : (
        <>
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
              introInputWrapper: "profile-wrapper__form-intro-input-wrapper",
            }}
          />
          {isEditing && isMobileView && buttonsWrapperEl}
        </>
      )}
    </div>
  );
}
