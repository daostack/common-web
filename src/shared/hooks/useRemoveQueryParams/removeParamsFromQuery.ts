import { parse, stringify } from "query-string";

export const removeParamsFromQuery = (
  search: string,
  keys: string | string[]
): string => {
  const queryParams = parse(search);
  const keysArray = typeof keys === "string" ? [keys] : keys;
  let isAnyParamRemoved = false;

  keysArray.forEach((key) => {
    if (key in queryParams) {
      delete queryParams[key];
      isAnyParamRemoved = true;
    }
  });

  if (!isAnyParamRemoved) {
    return search;
  }

  const newQuery = stringify(queryParams);

  return newQuery ? `?${newQuery}` : "";
};
