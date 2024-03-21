import { ReactNode } from "react";
import { SpaceListVisibility } from "@/shared/interfaces";

export interface Item {
  id: string;
  image: string;
  name: string;
  nameRightContent?: ReactNode;
  path: string;
  hasAccessToSpace?: boolean;
  hasMembership?: boolean;
  hasPermissionToAddProject?: boolean;
  notificationsAmount?: number;
  rightContent?: ReactNode;
  items?: Item[];
  disabled?: boolean;
  listVisibility?: SpaceListVisibility;
}
