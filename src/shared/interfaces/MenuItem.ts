import { ReactNode } from "react";
import { ROUTE_PATHS } from "@/shared/constants";

export enum MenuItemType {
  Link,
  Button,
}

interface GeneralItem {
  id: string;
  className?: string;
  text: ReactNode;
  withWarning?: boolean;
}

interface LinkItem extends GeneralItem {
  type: MenuItemType.Link;
  to: ROUTE_PATHS;
}

interface ButtonItem extends GeneralItem {
  type?: MenuItemType.Button;
  onClick: () => void;
}

export type MenuItem = LinkItem | ButtonItem;

export const CANCEL_MENU_ITEM_ID = "cancel";
