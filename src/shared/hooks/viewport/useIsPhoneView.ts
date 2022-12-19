import { ViewportBreakpoint } from "@/shared/constants";
import useScreenSize from "../useScreenSize";

// Is based on `phone` mixin
export const useIsPhoneView = (): boolean =>
  useScreenSize(`max-width: ${ViewportBreakpoint.Phone}px`);
