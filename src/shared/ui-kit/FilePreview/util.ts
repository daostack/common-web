const DOTS_COUNT = 3;

export const getFileName = (name: string, limit = 17) => {
  const fileNameParts = name.trim().split(".");
  const fileName = fileNameParts.slice(0, -1).join(".");
  const extension = fileNameParts.pop() ?? "";

  
  if (name.length > limit) {
    const fileNameLimit = limit - extension.length - DOTS_COUNT;
    return `${fileName.slice(0, fileNameLimit)}...${extension}`;
  }

  return `${fileName}.${extension}`;
};
