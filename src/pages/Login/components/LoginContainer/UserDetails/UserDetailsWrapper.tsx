import React from "react";
import { User } from "@/shared/models";
import UserDetails from "./UserDetails";
import "./index.scss";

interface UserDetailsWrapperProps {
  user: User;
  closeModal: () => void;
}

export default function UserDetailsWrapper({
  user,
  closeModal,
}: UserDetailsWrapperProps) {
  return (
    <div className="user-details-wrapper">
      <h2 className="user-details__title">Complete your account</h2>
      <p className="user-details__sub-title">
        Help the community to get to know you better
      </p>
      <UserDetails user={user} closeModal={closeModal} />
    </div>
  );
}
