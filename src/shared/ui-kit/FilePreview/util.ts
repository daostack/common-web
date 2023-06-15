export const getFileName = (name: string, limit = 14) => {
  const [fileName, extension] = name.split(".");

  if (fileName.length > limit - extension.length) {
    return `${fileName.slice(0, limit)}...${extension}`;
  }

  return `${fileName}.${extension}`;
};
