import { MouseEventHandler } from "react";

export interface ContextMenuItem {
  className?: string;
  text: string;
  onClick: MouseEventHandler;
  withWarning?: boolean;
}
