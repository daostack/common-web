import { ViewportBreakpoint } from "@/shared/constants";
import useScreenSize from "../useScreenSize";

// Is based on `desktop` mixin
export const useIsDesktopView = (): boolean =>
  useScreenSize(`min-width: ${ViewportBreakpoint.Desktop + 1}px`);
