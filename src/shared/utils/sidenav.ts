import { parse } from "query-string";
import { SIDENAV_KEY, SIDENAV_OPEN } from "@/shared/constants";
import { addQueryParam, deleteQueryParam } from "./queryParams";

export const openSidenav = () => {
  addQueryParam(SIDENAV_KEY, SIDENAV_OPEN);
};

export const closeSidenav = () => {
  deleteQueryParam(SIDENAV_KEY);
};

export const checkIsSidenavOpen = (queryParams: ReturnType<typeof parse>) =>
  queryParams[SIDENAV_KEY] === SIDENAV_OPEN;
