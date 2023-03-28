import React, { ReactNode } from "react";
import { Colors } from "../constants";

export enum ModalType {
  Default,
  MobilePopUp,
}

export enum CloseIconVariant {
  Regular = "regular",
  Thin = "thin",
}

export interface ModalProps {
  isShowing: boolean;
  type?: ModalType;
  onGoBack?: () => void;
  onClose: () => void;
  children: React.ReactNode;
  closeColor?: Colors;
  className?: string;
  mobileFullScreen?: boolean;
  title?: ReactNode;
  hideCloseButton?: boolean;
  closeIconVariant?: CloseIconVariant;
  closeIconSize?: number;
  isHeaderSticky?: boolean;
  shouldShowHeaderShadow?: boolean;
  onHeaderScrolledToTop?: (isHeaderScrolledToTop: boolean) => void;
  closePrompt?: boolean;
  withoutHorizontalPadding?: boolean;
  withoutHeader?: boolean;
  fullHeight?: boolean;
  styles?: {
    modalWrapper?: string;
    modalOverlay?: string;
    headerWrapper?: string;
    header?: string;
    closeWrapper?: string;
    content?: string;
  };
}

export interface ModalRef {
  scrollToTop: () => void;
}
