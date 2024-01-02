export enum ResizedFileSize {
  Avatars = "128x128",
  Images = "1200x1200",
}

export enum FilePrefix {
  UserAvatar,
  CommonAvatar,
  Image,
}

export const getResizedFileUrl = (
  src: string,
  fileSize: ResizedFileSize,
  filePrefix: FilePrefix,
) => {
  const regEx =
    filePrefix === FilePrefix.UserAvatar
      ? /(Fimg_[^.]+)\.([a-zA-Z]+)/
      : filePrefix === FilePrefix.CommonAvatar
      ? /(file_[^.]+)\.([a-zA-Z]+)/
      : /(Ffile_[^.]+)\.([a-zA-Z]+)/;
  return src.replace(regEx, `$1_${fileSize}.$2`);
};
