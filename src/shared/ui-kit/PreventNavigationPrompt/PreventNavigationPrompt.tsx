import React, { FC, ReactNode, useState } from "react";
import { Prompt } from "react-router-dom";
import { Action, Location } from "history";
import { Modal } from "@/shared/components/Modal";
import { ModalProps } from "@/shared/interfaces";

interface NavigationInfo {
  location: Location;
  action: Action;
}

interface PreventNavigationPromptProps {
  shouldPrevent: (info: NavigationInfo) => boolean;
  modalProps?: Omit<ModalProps, "isShowing" | "onClose">;
  children: (info: NavigationInfo) => ReactNode;
}

const PreventNavigationPrompt: FC<PreventNavigationPromptProps> = (props) => {
  const { shouldPrevent, modalProps, children } = props;
  const [navigationInfo, setNavigationInfo] = useState<NavigationInfo | null>(
    null,
  );

  const handlePromptMessage = (
    location: Location,
    action: Action,
  ): string | boolean => {
    if (shouldPrevent({ location, action })) {
      setNavigationInfo({ location, action });
    }

    return false;
  };

  const handleClose = () => {
    setNavigationInfo(null);
  };

  return (
    <>
      <Prompt message={handlePromptMessage} />
      {navigationInfo && (
        <Modal {...modalProps} isShowing onClose={handleClose}>
          {children(navigationInfo)}
        </Modal>
      )}
    </>
  );
};

export default PreventNavigationPrompt;
