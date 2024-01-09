import { useModal } from "@/shared/hooks";

export const useDeleteCommonModal = () => {
  const { isShowing, onOpen, onClose } = useModal(false);

  return {
    isDeleteCommonModalOpen: isShowing,
    onDeleteCommonModalClose: onClose,
    onCommonDelete: onOpen,
  };
};
