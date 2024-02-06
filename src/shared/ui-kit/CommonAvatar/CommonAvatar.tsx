import React from "react";
import { FC } from "react";
import { Image } from "@/shared/components/Image";
import { ThemeColors } from "@/shared/constants";
import useThemeColor from "@/shared/hooks/useThemeColor";
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
  const { getThemeColor } = useThemeColor();

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
          src={getRandomUserAvatarURL(
            name,
            getThemeColor(ThemeColors.tertiaryText),
          )}
          alt={alt || finalName}
        />
      }
    />
  );
};

export default CommonAvatar;
