import React, { FC } from "react";
import classNames from "classnames";
import { getRandomUserAvatarURL } from "../../utils";
import { Image } from "../Image";
import "./index.scss";

interface UserAvatarProps {
  className?: string;
  photoURL?: string;
  nameForRandomAvatar?: string;
  userName?: string;
  onClick?: () => void;
}

const UserAvatar: FC<UserAvatarProps> = (props) => {
  const { className, photoURL, nameForRandomAvatar, userName, onClick } = props;
  const randomUserAvatarURL = getRandomUserAvatarURL(nameForRandomAvatar);
  const userAvatarURL = photoURL || randomUserAvatarURL;
  const userAvatarAlt = `${userName || "user"} avatar`;
  const imageClassName = classNames("general-user-avatar", className);

  return (
    <Image
      className={imageClassName}
      src={userAvatarURL}
      alt={userAvatarAlt}
      onClick={onClick}
      placeholderElement={
        <Image
          className={imageClassName}
          src={randomUserAvatarURL}
          alt={userAvatarAlt}
          onClick={onClick}
        />
      }
    />
  );
};

export default UserAvatar;
