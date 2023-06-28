import React from "react";
import { FC } from "react";
import { Image } from "@/shared/components/Image";
import { getRandomUserAvatarURL } from "@/shared/utils";

interface CommonAvatarProps {
  name?: string;
  src?: string;
  className?: string;
  alt?: string;
}

const CommonAvatar: FC<CommonAvatarProps> = (props) => {
  const { src, name, className, alt } = props;

  if (!name) {
    return null;
  }

  return (
    <Image
      className={className}
      src={src}
      alt={alt ?? `${name}'s image`}
      placeholderElement={
        <Image
          className={className}
          src={getRandomUserAvatarURL(name)}
          alt={alt ?? name}
        />
      }
    />
  );
};

export default CommonAvatar;
