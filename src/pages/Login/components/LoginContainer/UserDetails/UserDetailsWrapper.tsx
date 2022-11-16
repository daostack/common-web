import React from "react";
import { User } from "@/shared/models";
import UserDetails from "./UserDetails";
import "./index.scss";

interface UserDetailsWrapperProps {
  user: User;
  isNewUser: boolean;
  closeModal: () => void;
}

export default function UserDetailsWrapper(props: UserDetailsWrapperProps) {
  const { user, isNewUser, closeModal } = props;

  return (
    <div className="user-details-wrapper">
      <h2 className="user-details__title">Complete your account</h2>
      <p className="user-details__sub-title">
        Help the community to get to know you better
      </p>
      <UserDetails user={user} isNewUser={isNewUser} closeModal={closeModal} />
    </div>
  );
}
