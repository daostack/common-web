import queryString from "query-string";
import { history } from "@/shared/appConfig";

export const getQueryParam = (key: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);

  return urlParams.get(key);
};

export const addQueryParam = (key: string, value: string) => {
  const params = queryString.parse(window.location.search);
  const search = queryString.stringify({
    ...params,
    [key]: value,
  });
  history.push({ search });
};

export const deleteQueryParam = (key: string, shouldReplace = false) => {
  const params = queryString.parse(window.location.search);

  if (!params[key]) {
    return;
  }

  delete params[key];
  const callback = shouldReplace ? history.replace : history.push;
  callback({
    search: queryString.stringify(params),
  });
};
