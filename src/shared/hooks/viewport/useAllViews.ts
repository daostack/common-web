import { ViewportStates } from "@/shared/interfaces";
import { useIsDesktopView } from "./useIsDesktopView";
import { useIsLaptopView } from "./useIsLaptopView";
import { useIsPhoneOrientedView } from "./useIsPhoneOrientedView";
import { useIsPhoneView } from "./useIsPhoneView";
import { useIsTabletView } from "./useIsTabletView";

export const useAllViews = (): ViewportStates => {
  const isDesktopView = useIsDesktopView();
  const isLaptopView = useIsLaptopView();
  const isTabletView = useIsTabletView();
  const isPhoneOrientedView = useIsPhoneOrientedView();
  const isPhoneView = useIsPhoneView();
  const isOnlyDesktopView = isDesktopView && !isLaptopView;
  const isOnlyLaptopView = isLaptopView && !isTabletView;
  const isOnlyTabletView = isTabletView && !isPhoneOrientedView;
  const isOnlyPhoneOrientedView = isPhoneOrientedView && !isPhoneView;
  const isOnlyPhoneView = isPhoneView;

  return {
    isDesktopView,
    isLaptopView,
    isTabletView,
    isPhoneOrientedView,
    isPhoneView,
    isOnlyDesktopView,
    isOnlyLaptopView,
    isOnlyTabletView,
    isOnlyPhoneOrientedView,
    isOnlyPhoneView,
  };
};
