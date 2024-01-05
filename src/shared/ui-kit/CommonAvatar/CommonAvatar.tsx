import React from "react";
import { FC } from "react";
import { Image } from "@/shared/components/Image";
import {
  FilePrefix,
  ResizeType,
  getRandomUserAvatarURL,
  getResizedFileUrl,
} from "@/shared/utils";

interface CommonAvatarProps {
  name?: string;
  src?: string;
  className?: string;
  alt?: string;
  useResizedFile?: boolean;
}

const CommonAvatar: FC<CommonAvatarProps> = (props) => {
  const { src = "", name, className, alt, useResizedFile = true } = props;
  const finalName = name ?? "unknown";

  return (
    <Image
      className={className}
      src={
        useResizedFile
          ? getResizedFileUrl(src, ResizeType.Avatars, FilePrefix.CommonAvatar)
          : src
      }
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
