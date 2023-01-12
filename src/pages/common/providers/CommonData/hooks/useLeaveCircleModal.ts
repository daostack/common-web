import { useCallback, useState } from "react";
import { useModal } from "@/shared/hooks";
import { Circle } from "@/shared/models";

interface State {
  circle: Circle | null;
  commonMemberId: string | null;
}

interface Return {
  circleToLeave: Circle | null;
  isLeaveCircleModalOpen: boolean;
  onLeaveCircleModalOpen: (
    commonId: string,
    commonMemberId: string,
    circle: Circle,
  ) => void;
  onLeaveCircleModalClose: () => void;
}

export const useLeaveCircleModal = (): Return => {
  const [leaveCircleState, setLeaveCircleState] = useState<State>({
    circle: null,
    commonMemberId: null,
  });
  const {
    isShowing: isLeaveCircleModalOpen,
    onOpen: onLeaveCircleModalOpen,
    onClose: onLeaveCircleModalClose,
  } = useModal(false);

  const handleLeaveCircleModalOpen = useCallback(
    (commonId: string, commonMemberId: string, circle: Circle) => {
      setLeaveCircleState({ circle, commonMemberId });
      onLeaveCircleModalOpen();
    },
    [onLeaveCircleModalOpen],
  );

  const handleLeaveCircleModalClose = useCallback(() => {
    onLeaveCircleModalClose();
    setLeaveCircleState({ circle: null, commonMemberId: null });
  }, [onLeaveCircleModalClose]);

  return {
    circleToLeave: leaveCircleState.circle,
    isLeaveCircleModalOpen,
    onLeaveCircleModalOpen: handleLeaveCircleModalOpen,
    onLeaveCircleModalClose: handleLeaveCircleModalClose,
  };
};
