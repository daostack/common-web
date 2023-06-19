export const getFileName = (name: string, limit = 14) => {
  const fileNameParts = name.trim().split(".");
  const fileName = fileNameParts.slice(0, -1).join(".");
  const extension = fileNameParts.pop() ?? "";

  if (fileName.length > limit - extension.length) {
    return `${fileName.slice(0, limit)}...${extension}`;
  }

  return `${fileName}.${extension}`;
};
