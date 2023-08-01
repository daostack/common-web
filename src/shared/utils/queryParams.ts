import queryString from "query-string";
import { history } from "@/shared/appConfig";

export const addQueryParam = (key: string, value: string) => {
  const params = queryString.parse(window.location.search);
  const search = queryString.stringify({
    ...params,
    [key]: value,
  });
  history.push({ search });
};

export const deleteQueryParam = (key: string) => {
  const params = queryString.parse(window.location.search);

  if (params[key]) {
    delete params[key];
    history.push({
      search: queryString.stringify(params),
    });
  }
};
