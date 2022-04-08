import React from "react";
import { useSelector } from "react-redux";
import { UserDetails } from "@/containers/Login/components/LoginContainer/UserDetails";
import { selectUser } from "@/containers/Auth/store/selectors";
import { ButtonIcon, Loader } from "@/shared/components";
import EditIcon from "@/shared/icons/edit.icon";
import "./index.scss";

export default function Profile() {
  const user = useSelector(selectUser());

  return (
    <div className="route-content profile-wrapper">
      <header className="profile-wrapper__header">
        <h2 className="route-title">Profile</h2>
        <ButtonIcon>
          <EditIcon />
        </ButtonIcon>
      </header>
      {!user ? (
        <Loader />
      ) : (
        <UserDetails
          className="profile-wrapper__user-details"
          user={user}
          showAuthProvider={false}
          customSaveButton
          isCountryDropdownFixed={false}
          styles={{
            avatarWrapper: "profile-wrapper__avatar-wrapper",
            avatar: "profile-wrapper__avatar",
            userAvatar: "profile-wrapper__user-avatar",
            editAvatar: "profile-wrapper__edit-avatar",
            fieldContainer: "profile-wrapper__field-container",
            introInputWrapper: "profile-wrapper__form-intro-input-wrapper",
          }}
        />
      )}
    </div>
  );
}
