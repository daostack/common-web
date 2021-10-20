import React from "react";

import { Colors } from "../constants";

export interface ModalProps {
  isShowing: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeColor?: Colors;
  className?: string;
}
