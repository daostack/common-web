import { useModal } from "@/shared/hooks";

interface Return {
  isLeaveCommonModalOpen: boolean;
  onLeaveCommonModalOpen: () => void;
  onLeaveCommonModalClose: () => void;
}

export const useLeaveCommonModal = (): Return => {
  const {
    isShowing: isLeaveCommonModalOpen,
    onOpen: onLeaveCommonModalOpen,
    onClose: onLeaveCommonModalClose,
  } = useModal(true);

  return {
    isLeaveCommonModalOpen,
    onLeaveCommonModalOpen,
    onLeaveCommonModalClose,
  };
};
