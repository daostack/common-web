import { ViewportBreakpoint } from "@/shared/constants";
import useScreenSize from "../useScreenSize";

// Is based on `laptop` mixin
export const useIsLaptopView = (): boolean =>
  useScreenSize(`max-width: ${ViewportBreakpoint.Desktop}px`);
