const BYTE_CONVERTER = 1024;

export const convertBytes = (sizeInBytes: number): string => {
  const sizeInMB = (sizeInBytes / (BYTE_CONVERTER*BYTE_CONVERTER));

  if(sizeInMB < 1) {
    return `${(sizeInBytes / BYTE_CONVERTER).toFixed(2)} K`;
  }

  return `${sizeInMB.toFixed(2)} MB`
}