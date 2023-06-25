import { history } from "@/shared/appConfig";
import { SIDENAV_KEY, SIDENAV_OPEN } from "@/shared/constants";
import { getInboxPagePath } from "@/shared/utils";

export const openSidenav = () => {
  history.push({
    pathname: getInboxPagePath(),
    search: `?${SIDENAV_KEY}=${SIDENAV_OPEN}`,
  });
}