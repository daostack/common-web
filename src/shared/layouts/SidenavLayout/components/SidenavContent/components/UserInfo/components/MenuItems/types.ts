import { ReactNode } from "react";
import { ROUTE_PATHS } from "@/shared/constants";

export enum ItemType {
  Link,
  Button,
}

interface GeneralItem {
  key: string;
  text: ReactNode;
}

interface LinkItem extends GeneralItem {
  type?: ItemType.Link;
  to: ROUTE_PATHS;
}

interface ButtonItem extends GeneralItem {
  type: ItemType.Button;
  onClick: () => void;
}

export type Item = LinkItem | ButtonItem;
