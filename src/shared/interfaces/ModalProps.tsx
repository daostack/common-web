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
  isHeaderSticky?: boolean;
  onHeaderScrolledToTop?: (isHeaderScrolledToTop: boolean) => void;
}
