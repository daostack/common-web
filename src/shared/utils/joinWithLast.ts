/**
 * Returns the string array values, separated by a specified separator and lastSeperator for the last item.
 */
export const joinWithLast = (
  arr?: string[],
  seperator = ", ",
  lastSeperator = " & ",
): string => {
  if (!arr) {
    return "";
  }
  if (arr.length === 1) {
    return arr[0];
  }
  return arr.slice(0, -1).join(seperator) + lastSeperator + arr.slice(-1);
};
