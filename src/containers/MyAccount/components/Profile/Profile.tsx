import React, { useState } from "react";
import { useSelector } from "react-redux";
import { UserDetails } from "@/containers/Login/components/LoginContainer/UserDetails";
import { selectUser } from "@/containers/Auth/store/selectors";
import { Button, ButtonIcon, ButtonVariant, Loader } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import EditIcon from "@/shared/icons/edit.icon";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector(selectUser());
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const buttonsWrapperEl = (
    <div className="profile-wrapper__buttons-wrapper">
      <Button
        className="profile-wrapper__button"
        variant={ButtonVariant.Secondary}
        onClick={handleCancelClick}
        shouldUseFullWidth
      >
        Cancel
      </Button>
      <Button className="profile-wrapper__button" shouldUseFullWidth>
        Save
      </Button>
    </div>
  );

  return (
    <div className="route-content profile-wrapper">
      <header className="profile-wrapper__header">
        <h2 className="route-title">Profile</h2>
        {isEditing && !isMobileView && buttonsWrapperEl}
        {!isEditing && (
          <ButtonIcon onClick={handleEditClick}>
            <EditIcon />
          </ButtonIcon>
        )}
      </header>
      {!user ? (
        <Loader />
      ) : (
        <>
          <UserDetails
            className="profile-wrapper__user-details"
            user={user}
            showAuthProvider={false}
            customSaveButton
            isCountryDropdownFixed={false}
            isEditing={isEditing}
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
