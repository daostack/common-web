import React, { useContext, ReactNode } from "react";

export interface FooterOptions {
  sticky?: boolean;
}

export interface ModalContextValue {
  setFooter: (footer: ReactNode) => void;
  setFooterOptions: (options: FooterOptions) => void;
  setHeaderContent: (headerContent: ReactNode) => void;
}

export const ModalContext = React.createContext<ModalContextValue>({
  setFooter: () => {
    throw new Error('Modal Footer is not the child of Modal');
  },
  setFooterOptions: () => {
    throw new Error('Modal Footer is not the child of Modal');
  },
  setHeaderContent: () => {
    throw new Error('Modal Header Content is not the child of Modal');
  },
});

export const useModalContext = (): ModalContextValue => useContext(ModalContext);
