export const getCircleNamesAsString = (circleNames: string[]): string => {
  if (circleNames.length <= 2) {
    return circleNames.join(" and ");
  }

  return `${circleNames.slice(0, -1).join(", ")} and ${
    circleNames[circleNames.length - 1]
  }`;
};
