export enum ResizedFileSize {
  Avatars = "128x128",
  Images = "1200x1200",
}

export const getResizedFileUrl = (
  src: string,
  fileSize: ResizedFileSize,
  userAvatar?: boolean,
) => {
  const regEx = userAvatar
    ? /(Fimg_[^.]+)\.([a-zA-Z]+)/
    : /(file_[^.]+)\.([a-zA-Z]+)/;
  return src.replace(regEx, `$1_${fileSize}.$2`);
};
