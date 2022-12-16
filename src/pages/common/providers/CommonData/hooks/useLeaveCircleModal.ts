import { useCallback } from "react";
import { useModal } from "@/shared/hooks";
import { Circle } from "@/shared/models";

interface Return {
  isLeaveCircleModalOpen: boolean;
  onLeaveCircleModalOpen: (circle: Circle) => void;
  onLeaveCircleModalClose: () => void;
}

export const useLeaveCircleModal = (): Return => {
  const {
    isShowing: isLeaveCircleModalOpen,
    onOpen: onLeaveCircleModalOpen,
    onClose: onLeaveCircleModalClose,
  } = useModal(true);

  const handleLeaveCircleModalOpen = useCallback(
    (circle: Circle) => {
      onLeaveCircleModalOpen();
    },
    [onLeaveCircleModalOpen],
  );

  return {
    isLeaveCircleModalOpen,
    onLeaveCircleModalOpen: handleLeaveCircleModalOpen,
    onLeaveCircleModalClose,
  };
};
