import { OldLayoutRouteOptions } from "@/pages/App/router";
import { ScreenSize } from "@/shared/constants";

export const checkFooterVisibility = (
  footerOptions: OldLayoutRouteOptions["footer"],
  currentScreenSize: ScreenSize,
): boolean => {
  if (!footerOptions || typeof footerOptions === "boolean") {
    return footerOptions ?? true;
  }

  const { screenSizeWhenDisplay } = footerOptions;

  return !screenSizeWhenDisplay || screenSizeWhenDisplay === currentScreenSize;
};
