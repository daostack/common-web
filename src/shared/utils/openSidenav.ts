import { SIDENAV_ID } from "../constants";

export const openSidenav = (): void => {
  window.location.hash = SIDENAV_ID;
};
