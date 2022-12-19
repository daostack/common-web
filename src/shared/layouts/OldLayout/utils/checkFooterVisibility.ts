import { OldLayoutRouteOptions } from "@/pages/App/router";

export const checkFooterVisibility = (
  footerOptions: OldLayoutRouteOptions["footer"],
): boolean => {
  if (!footerOptions || typeof footerOptions === "boolean") {
    return footerOptions ?? true;
  }

  const { mediaQueryWhenDisplay } = footerOptions;

  return (
    !mediaQueryWhenDisplay || window.matchMedia(mediaQueryWhenDisplay).matches
  );
};
