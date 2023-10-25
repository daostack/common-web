import { ViewportBreakpoint } from "@/shared/constants";
import useScreenSize from "../useScreenSize";

export const useIsBigPhoneView = (): boolean =>
  useScreenSize(`max-width: ${ViewportBreakpoint.BigPhone}px`);
