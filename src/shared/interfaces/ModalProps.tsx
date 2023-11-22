import React, { ReactNode } from "react";

export enum ModalType {
  Default,
  MobilePopUp,
}

export interface ModalProps {
  isShowing: boolean;
  type?: ModalType;
  onGoBack?: () => void;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  mobileFullScreen?: boolean;
  title?: ReactNode;
  hideCloseButton?: boolean;
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
