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
  const { src = "", name, className, alt } = props;
  const finalName = name ?? "unknown";

  return (
    <Image
      className={className}
      src={src}
      alt={alt ?? `${finalName}'s image`}
      placeholderElement={
        <Image
          className={className}
          src={getRandomUserAvatarURL(name)}
          alt={alt || finalName}
        />
      }
    />
  );
};

export default CommonAvatar;
