import { ViewportBreakpoint } from "@/shared/constants";
import useScreenSize from "../useScreenSize";

// Is based on `phone-orientated` mixin
export const useIsPhoneOrientedView = (): boolean =>
  useScreenSize(`max-width: ${ViewportBreakpoint.Tablet}px`);
