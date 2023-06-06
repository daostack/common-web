import React, { FC } from "react";
import classNames from "classnames";
import { getRandomUserAvatarURL } from "../../utils";
import { Image } from "../Image";
import "./index.scss";

interface UserAvatarProps {
  className?: string;
  imageContainerClassName?: string;
  photoURL?: string;
  nameForRandomAvatar?: string;
  userName?: string;
  preloaderSrc?: string;
  onClick?: () => void;
}

const UserAvatar: FC<UserAvatarProps> = (props) => {
  const {
    className,
    imageContainerClassName,
    photoURL,
    userName,
    nameForRandomAvatar = userName,
    preloaderSrc,
    onClick,
  } = props;
  const randomUserAvatarURL = getRandomUserAvatarURL(nameForRandomAvatar);
  const userAvatarURL = photoURL || randomUserAvatarURL;
  const userAvatarAlt = `${userName || "User"}'s avatar`;
  const imageClassName = classNames("general-user-avatar", className);

  return (
    <Image
      className={imageClassName}
      imageContainerClassName={imageContainerClassName}
      src={userAvatarURL}
      alt={userAvatarAlt}
      preloaderSrc={preloaderSrc}
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
