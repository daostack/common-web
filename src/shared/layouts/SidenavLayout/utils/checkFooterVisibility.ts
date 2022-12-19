import { SidenavLayoutRouteOptions } from "@/pages/App/router";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { ViewportStates } from "@/shared/interfaces";

const getViewportVariantToStateMap = (
  viewportStates: ViewportStates,
): Record<ViewportBreakpointVariant, boolean> => ({
  [ViewportBreakpointVariant.Desktop]: viewportStates.isOnlyDesktopView,
  [ViewportBreakpointVariant.Laptop]: viewportStates.isOnlyLaptopView,
  [ViewportBreakpointVariant.Tablet]: viewportStates.isOnlyTabletView,
  [ViewportBreakpointVariant.PhoneOriented]:
    viewportStates.isOnlyPhoneOrientedView,
  [ViewportBreakpointVariant.Phone]: viewportStates.isOnlyPhoneView,
});

export const checkFooterVisibility = (
  footerOptions: SidenavLayoutRouteOptions["footer"],
  viewportStates: ViewportStates,
): boolean => {
  if (!footerOptions || typeof footerOptions === "boolean") {
    return footerOptions ?? true;
  }

  const { displayedOnViewports = [] } = footerOptions;

  if (displayedOnViewports.length === 0) {
    return false;
  }

  const viewportVariantToStateMap =
    getViewportVariantToStateMap(viewportStates);

  return displayedOnViewports.some(
    (viewportVariant) => viewportVariantToStateMap[viewportVariant],
  );
};
