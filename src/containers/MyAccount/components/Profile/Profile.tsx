import React from "react";
import { useSelector } from "react-redux";
import { UserDetails } from "@/containers/Login/components/LoginContainer/UserDetails";
import { selectUser } from "@/containers/Auth/store/selectors";
import { Loader } from "@/shared/components";
import "./index.scss";

export default function Profile() {
  const user = useSelector(selectUser());

  return (
    <div className="route-content profile-wrapper">
      <span className="route-title">Profile</span>
      {!user ? <Loader /> : <UserDetails user={user} />}
    </div>
  )
}
