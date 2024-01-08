export enum FilePrefix {
  UserAvatar,
  CommonAvatar,
  Image,
}

export enum ResizeType {
  Avatars = "avatar",
  Images = "images",
}

const MAP_FILE_PREFIX_TO_REG_EXP: Record<FilePrefix, RegExp> = {
  [FilePrefix.UserAvatar]: /(Fimg_[^.]+)\.([a-zA-Z]+)/,
  [FilePrefix.CommonAvatar]: /(file_[^.]+)\.([a-zA-Z]+)/,
  [FilePrefix.Image]: /(Ffile_[^.]+)\.([a-zA-Z]+)/,
};

const MAP_RESIZE_TYPE_TO_FILE_SIZE: Record<ResizeType, string> = {
  [ResizeType.Avatars]: "128x128",
  [ResizeType.Images]: "1200x1200",
};

export const getResizedFileUrl = (
  src: string,
  fileSize: ResizeType,
  filePrefix: FilePrefix,
) => {
  return src.replace(
    MAP_FILE_PREFIX_TO_REG_EXP[filePrefix],
    `$1_${MAP_RESIZE_TYPE_TO_FILE_SIZE[fileSize]}.$2`,
  );
};
