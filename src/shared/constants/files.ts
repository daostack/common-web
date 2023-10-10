export const FILES_ACCEPTED_EXTENSIONS =
  ".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .rtf, .odt, .ods, .odp, .pages, .numbers, .key, .jpg, .jpeg, .png, .gif, .tiff, .bmp, .webp, .mp4, .avi, .mov, .mkv, .mpeg, .mp3, .aac, .flac, .wav, .ogg, .zip, .rar, .7z, .tar, .gz, .apk, .epub, .vcf, .xml, .csv, .json, .docm, .dot, .dotm, .dotx, .fdf, .fodp, .fods, .fodt, .pot, .potm, .potx, .ppa, .ppam, .pps, .ppsm, .ppsx, .pptm, .sldx, .xlm, .xlsb, .xlsm, .xlt, .xltm, .xltx, .xps, .mobi, .azw, .azw3, .prc, .svg, .ico, .jp2, .3gp, .3g2, .flv, .m4v, .mk3d, .mks, .mpg, .mpeg2, .mpeg4, .mts, .vob, .wmv, .m4a, .opus, .wma, .cbr, .cbz, .tgz, .apng, .m4b, .m4p, .m4r, .webm, .sh, .py, .java, .cpp, .cs, .js, .html, .css, .php, .rb, .pl, .sql";
export const IMAGE_EXTENSIONS = ".jpg, .jpeg, .png, .gif, .tiff, .bmp, .webp, .svg, .ico, .jp2, .apng";

export const MAX_IMAGE_UPLOAD_SIZE = 6000000;

export const MAX_IMAGE_UPLOAD_SIZE_MB = MAX_IMAGE_UPLOAD_SIZE / 1000 / 1000;
export const MAX_IMAGE_UPLOAD_SIZE_ERROR = `Heads up! Your image exceeds the ${MAX_IMAGE_UPLOAD_SIZE_MB}MB limit. Can you upload a smaller one?`;

export const getFileExtension = (fileName: string): string => {
  return fileName.split(".").pop() ?? "";
}

export const isImageFile = (fileName: string): boolean  => {
  const extension = getFileExtension(fileName);

  return IMAGE_EXTENSIONS.includes(extension);
}