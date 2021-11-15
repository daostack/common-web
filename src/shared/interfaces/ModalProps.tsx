import React from "react";

import { Colors } from "../constants";

export interface ModalProps {
  isShowing: boolean;
  onGoBack?: () => void;
  onClose: () => void;
  children: React.ReactNode;
  closeColor?: Colors;
  className?: string;
  mobileFullScreen?: boolean;
}
