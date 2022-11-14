import { ViewportBreakpoint } from "@/shared/constants";
import useScreenSize from "../useScreenSize";

// Is based on `tablet` mixin
export const useIsTabletView = (): boolean =>
  useScreenSize(`max-width: ${ViewportBreakpoint.Laptop}px`);
