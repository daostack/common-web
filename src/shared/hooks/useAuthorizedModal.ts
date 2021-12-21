import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoginModalShowing } from "../../containers/Auth/store/actions";
import { authentificated, selectIsLoginModalShowing } from "../../containers/Auth/store/selectors";

interface AuthorizedModalReturn {
  isModalOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useAuthorizedModal = (): AuthorizedModalReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldShowModalOnLoginClose, setShouldShowModalOnLoginClose] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(authentificated());
  const isLoginModalShowing = useSelector(selectIsLoginModalShowing());

  const onOpen = useCallback(() => {
    if (isAuthenticated) {
      setIsModalOpen(true);
      return;
    }

    dispatch(setIsLoginModalShowing(true));
    setShouldShowModalOnLoginClose(true);
  }, [isAuthenticated, dispatch]);

  const onClose = useCallback(() => {
    setShouldShowModalOnLoginClose(false);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    if (shouldShowModalOnLoginClose && !isLoginModalShowing) {
      setShouldShowModalOnLoginClose(false);
      setIsModalOpen(isAuthenticated);
    }
  }, [shouldShowModalOnLoginClose, isLoginModalShowing, isAuthenticated]);

  return {
    isModalOpen,
    onClose,
    onOpen,
  };
};

export default useAuthorizedModal;
