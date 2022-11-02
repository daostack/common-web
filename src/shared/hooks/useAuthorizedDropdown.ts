import { useCallback, useEffect, useState, RefObject } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DropdownRef } from "@/shared/components";
import { setLoginModalState } from "../../pages/Auth/store/actions";
import {
  authentificated,
  selectLoginModalState,
} from "../../pages/Auth/store/selectors";

interface AuthorizedModalReturn {
  onDropdownToggle: (isOpen: boolean) => void;
}

const useAuthorizedDropdown = (
  dropdownRef: RefObject<DropdownRef>,
): AuthorizedModalReturn => {
  const [shouldShowDropdownOnLoginClose, setShouldShowDropdownOnLoginClose] =
    useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(authentificated());
  const { isShowing: isLoginModalShowing } = useSelector(
    selectLoginModalState(),
  );

  const onDropdownToggle = useCallback(
    (isOpen: boolean) => {
      if (!isOpen || isAuthenticated) {
        return;
      }

      dropdownRef.current?.closeDropdown();
      dispatch(setLoginModalState({ isShowing: true }));
      setShouldShowDropdownOnLoginClose(true);
    },
    [isAuthenticated, dropdownRef, dispatch],
  );

  useEffect(() => {
    if (shouldShowDropdownOnLoginClose && !isLoginModalShowing) {
      setShouldShowDropdownOnLoginClose(false);

      if (isAuthenticated) {
        dropdownRef.current?.openDropdown();
      }
    }
  }, [
    shouldShowDropdownOnLoginClose,
    dropdownRef,
    isLoginModalShowing,
    isAuthenticated,
  ]);

  return {
    onDropdownToggle,
  };
};

export default useAuthorizedDropdown;
