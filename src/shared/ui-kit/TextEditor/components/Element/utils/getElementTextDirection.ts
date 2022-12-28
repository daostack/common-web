import { Element } from "slate";
import { FormatType } from "../../../constants";

export const getElementTextDirection = (
  element: Element,
  initialDir?: "rtl",
): "rtl" | undefined => {
  if (typeof element.textDirection === "undefined") {
    return initialDir;
  }

  return element.textDirection === FormatType.RTL ? "rtl" : undefined;
};
