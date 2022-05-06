import React, { FC } from "react";
import { getUserName } from "@/shared/utils";
import { User } from "@/shared/models";
import { countryList } from "@/shared/assets/countries";
import "./index.scss";

interface UserDetailsPreviewProps {
  user: User;
}

const UserDetailsPreview: FC<UserDetailsPreviewProps> = (props) => {
  const { user } = props;
  const country = countryList.find((item) => item.value === user.country);

  return (
    <div className="user-details-preview">
      <p className="user-details-preview__name">{getUserName(user)}</p>
      {user.email && <p className="user-details-preview__info">{user.email}</p>}
      {country && <p className="user-details-preview__info">{country.name}</p>}
      {user.intro && (
        <div className="user-details-preview__intro-wrapper">
          <h4 className="user-details-preview__intro-title">Intro</h4>
          <p className="user-details-preview__intro-content">{user.intro}</p>
        </div>
      )}
    </div>
  );
};

export default UserDetailsPreview;
