import { MouseEventHandler } from "react";

export interface ContextMenuItem {
  id: string;
  className?: string;
  text: string;
  onClick: MouseEventHandler;
  withWarning?: boolean;
}
