import React, { FC } from "react";
import classNames from "classnames";
import { ThemeColors } from "@/shared/constants";
import useThemeColor from "@/shared/hooks/useThemeColor";
import {
  FilePrefix,
  ResizeType,
  getRandomUserAvatarURL,
  getResizedFileUrl,
} from "../../utils";
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
  useResizedFile?: boolean;
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
    useResizedFile = true,
  } = props;
  const { getThemeColor } = useThemeColor();
  const randomUserAvatarURL = getRandomUserAvatarURL(
    nameForRandomAvatar,
    getThemeColor(ThemeColors.tertiaryText),
  );
  const userAvatarURL = photoURL || randomUserAvatarURL;
  const userAvatarAlt = `${userName || "User"}'s avatar`;
  const imageClassName = classNames("general-user-avatar", className);
  const isGoogleImage = userAvatarURL.includes("googleusercontent");

  return (
    <Image
      className={imageClassName}
      imageContainerClassName={imageContainerClassName}
      src={
        useResizedFile && !isGoogleImage
          ? getResizedFileUrl(
              userAvatarURL,
              ResizeType.Avatars,
              FilePrefix.UserAvatar,
            )
          : userAvatarURL
      }
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
