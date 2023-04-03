import { MouseEventHandler, ReactNode } from "react";
import { ROUTE_PATHS } from "@/shared/constants";

export enum MenuItemType {
  Link,
  Button,
}

interface GeneralItem<Text = ReactNode> {
  id: string;
  className?: string;
  activeClassName?: string;
  text: Text;
  withWarning?: boolean;
}

interface LinkItem<Text = ReactNode> extends GeneralItem<Text> {
  type: MenuItemType.Link;
  to: ROUTE_PATHS;
}

interface ButtonItem<Text = ReactNode> extends GeneralItem<Text> {
  type?: MenuItemType.Button;
  onClick: MouseEventHandler;
}

export type MenuItem<Text = ReactNode> = LinkItem<Text> | ButtonItem<Text>;

export const CANCEL_MENU_ITEM_ID = "cancel";
