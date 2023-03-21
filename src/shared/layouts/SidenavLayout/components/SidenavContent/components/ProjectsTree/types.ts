import { ReactNode } from "react";

export interface Item {
  id: string;
  image: string;
  name: string;
  path: string;
  hasMembership?: boolean;
  hasPermissionToAddProject?: boolean;
  notificationsAmount?: number;
  rightContent?: ReactNode;
  items?: Item[];
}
