export const getSidenavLeft = (viewportWidth: number) => {
  if (viewportWidth <= 1920) {
    return 0;
  }

  return Math.floor((viewportWidth - 1920) / 2);
};
