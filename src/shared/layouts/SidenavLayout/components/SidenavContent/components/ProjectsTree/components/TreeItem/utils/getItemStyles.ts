import { CSSProperties } from "react";

export const getItemStyles = (level: number): CSSProperties =>
  ({
    "--tree-level": level,
  } as CSSProperties);
