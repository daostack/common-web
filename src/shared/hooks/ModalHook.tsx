import { useState, useCallback } from "react";

const useModal = (show: boolean) => {
  const [isShowing, setIsShowing] = useState(show);

  const onClose = useCallback(() => {
    setIsShowing(false);
  }, []);

  const onOpen = useCallback(() => {
    setIsShowing(true);
  }, []);

  return {
    isShowing,
    onClose,
    onOpen,
  };
};

export default useModal;
