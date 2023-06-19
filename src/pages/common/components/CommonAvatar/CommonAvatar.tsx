import React from "react";
import { FC } from "react";
import { Image } from "@/shared/components/Image";
import { getRandomUserAvatarURL } from "@/shared/utils";

interface CommonAvatarProps {
  name: string;
  src?: string;
  className?: string;
}

const CommonAvatar: FC<CommonAvatarProps> = (props) => {
  const { src, name, className } = props;

  return (
    <Image
      className={className}
      src={src}
      alt={`${name}'s image`}
      placeholderElement={
        <Image
          className={className}
          src={getRandomUserAvatarURL(name)}
          alt={name}
        />
      }
    />
  );
};

export default CommonAvatar;
