import React, { ReactNode } from "react";

import { Colors } from "../constants";

export interface ModalProps {
  isShowing: boolean;
  onGoBack?: () => void;
  onClose: () => void;
  children: React.ReactNode;
  closeColor?: Colors;
  className?: string;
  mobileFullScreen?: boolean;
  title?: ReactNode;
  hideCloseButton?: boolean;
  isHeaderSticky?: boolean;
  shouldShowHeaderShadow?: boolean;
  onHeaderScrolledToTop?: (isHeaderScrolledToTop: boolean) => void;
  closePrompt?: boolean;
  styles?: {
    headerWrapper?: string;
  };
}
