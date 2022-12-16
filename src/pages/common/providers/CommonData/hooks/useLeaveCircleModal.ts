import { useCallback, useState } from "react";
import { useModal } from "@/shared/hooks";
import { Circle } from "@/shared/models";

interface Return {
  circleToLeave: Circle | null;
  isLeaveCircleModalOpen: boolean;
  onLeaveCircleModalOpen: (circle: Circle) => void;
  onLeaveCircleModalClose: () => void;
}

export const useLeaveCircleModal = (): Return => {
  const [circleToLeave, setCircleToLeave] = useState<Circle | null>(null);
  const {
    isShowing: isLeaveCircleModalOpen,
    onOpen: onLeaveCircleModalOpen,
    onClose: onLeaveCircleModalClose,
  } = useModal(false);

  const handleLeaveCircleModalOpen = useCallback(
    (circle: Circle) => {
      setCircleToLeave(circle);
      onLeaveCircleModalOpen();
    },
    [onLeaveCircleModalOpen],
  );

  return {
    circleToLeave,
    isLeaveCircleModalOpen,
    onLeaveCircleModalOpen: handleLeaveCircleModalOpen,
    onLeaveCircleModalClose,
  };
};
