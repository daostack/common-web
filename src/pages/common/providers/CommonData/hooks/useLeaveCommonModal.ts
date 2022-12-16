import { useCallback } from "react";
import { useModal } from "@/shared/hooks";
import { Circle } from "@/shared/models";

interface Return {
  isLeaveCommonModalOpen: boolean;
  onLeaveCommonModalOpen: (circle: Circle) => void;
  onLeaveCommonModalClose: () => void;
}

export const useLeaveCommonModal = (): Return => {
  const {
    isShowing: isLeaveCommonModalOpen,
    onOpen: onLeaveCommonModalOpen,
    onClose: onLeaveCommonModalClose,
  } = useModal(true);

  const handleLeaveCommonModalOpen = useCallback(
    (circle: Circle) => {
      onLeaveCommonModalOpen();
    },
    [onLeaveCommonModalOpen],
  );

  return {
    isLeaveCommonModalOpen,
    onLeaveCommonModalOpen: handleLeaveCommonModalOpen,
    onLeaveCommonModalClose,
  };
};
