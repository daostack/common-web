import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Prompt, useHistory } from "react-router-dom";
import { Action, Location } from "history";
import { Modal } from "@/shared/components/Modal";
import { ModalProps } from "@/shared/interfaces";

interface NavigationInfo {
  location: Location;
  action: Action;
}

interface ContentProps extends NavigationInfo {
  confirmNavigation: () => void;
  cancelNavigation: () => void;
}

export interface PreventNavigationPromptProps {
  shouldPrevent: (info: NavigationInfo) => boolean;
  modalProps?: Omit<ModalProps, "isShowing" | "onClose" | "children">;
  children: (info: ContentProps) => ReactNode;
}

const PreventNavigationPrompt: FC<PreventNavigationPromptProps> = (props) => {
  const { shouldPrevent, modalProps, children } = props;
  const history = useHistory();
  const isInternalNavigationRef = useRef(false);
  const [navigationInfo, setNavigationInfo] = useState<NavigationInfo | null>(
    null,
  );

  const handlePromptMessage = (
    location: Location,
    action: Action,
  ): string | boolean => {
    if (
      isInternalNavigationRef.current ||
      !shouldPrevent({ location, action })
    ) {
      return true;
    }

    setNavigationInfo({ location, action });

    return false;
  };

  const handleClose = () => {
    setNavigationInfo(null);
  };

  const confirmNavigation = () => {
    if (!navigationInfo) {
      return;
    }

    isInternalNavigationRef.current = true;

    switch (navigationInfo.action) {
      case "REPLACE":
        history.replace(navigationInfo.location);
        break;
      case "POP":
        history.goBack();
        break;
      default:
        history.push(navigationInfo.location);
        break;
    }
  };

  useEffect(() => {
    isInternalNavigationRef.current = false;
  }, [history.location.pathname]);

  return (
    <>
      <Prompt message={handlePromptMessage} />
      {navigationInfo && (
        <Modal {...modalProps} isShowing onClose={handleClose}>
          {children({
            ...navigationInfo,
            confirmNavigation,
            cancelNavigation: handleClose,
          })}
        </Modal>
      )}
    </>
  );
};

export default PreventNavigationPrompt;
