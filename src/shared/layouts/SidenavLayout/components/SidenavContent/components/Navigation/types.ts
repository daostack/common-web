import { ROUTE_PATHS } from "@/shared/constants";

export enum NavigationItemType {
  Link = "link",
  Block = "block",
}

export interface NavigationItemOptions {
  text: string;
  route: ROUTE_PATHS;
  disabled?: boolean;
  type?: NavigationItemType;
}
