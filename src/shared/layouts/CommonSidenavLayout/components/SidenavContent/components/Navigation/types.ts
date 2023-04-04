import { ReactNode } from "react";
import { ROUTE_PATHS } from "@/shared/constants";

export enum NavigationItemType {
  Link = "link",
  Block = "block",
}

export interface NavigationItemOptions {
  text: string;
  route: ROUTE_PATHS;
  icon: ReactNode;
  type?: NavigationItemType;
  isActive?: boolean;
  isDisabled?: boolean;
  notificationsAmount?: number;
  tooltipContent?: ReactNode | null;
}
