import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginModalType } from "../../pages/Auth/interface";
import { setLoginModalState } from "../../pages/Auth/store/actions";
import {
  authentificated,
  selectLoginModalState,
} from "../../pages/Auth/store/selectors";

interface AuthorizedModalReturn {
  isModalOpen: boolean;
  onOpen: (loginModalType?: LoginModalType) => void;
  onClose: () => void;
}

const useAuthorizedModal = (): AuthorizedModalReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldShowModalOnLoginClose, setShouldShowModalOnLoginClose] =
    useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(authentificated());
  const { isShowing: isLoginModalShowing } = useSelector(
    selectLoginModalState(),
  );

  const onOpen = useCallback(
    (loginModalType?: LoginModalType) => {
      if (isAuthenticated) {
        setIsModalOpen(true);
        return;
      }

      dispatch(setLoginModalState({ isShowing: true, type: loginModalType }));
      setShouldShowModalOnLoginClose(true);
    },
    [isAuthenticated, dispatch],
  );

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
