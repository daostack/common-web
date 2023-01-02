import { CSSProperties } from "react";
import { RenderElementProps } from "slate-react";

export type ElementAttributes = RenderElementProps["attributes"] & {
  className?: string;
  style?: CSSProperties;
};
