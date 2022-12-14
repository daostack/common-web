import { useCallback } from "react";
import { useHistory } from "react-router";
import { ROUTE_PATHS } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import { Common } from "@/shared/models";

interface Return {
  isSubCommonCreationModalOpen: boolean;
  onSubCommonCreationModalOpen: () => void;
  onSubCommonCreationModalClose: () => void;
  onSubCommonCreate: (common: Common) => void;
}

export const useSubCommonCreationModal = (): Return => {
  const history = useHistory();
  const {
    isShowing: isSubCommonCreationModalOpen,
    onOpen: onSubCommonCreationModalOpen,
    onClose: onSubCommonCreationModalClose,
  } = useModal(false);

  const onSubCommonCreate = useCallback(
    (createdCommon: Common) => {
      onSubCommonCreationModalClose();
      history.push(ROUTE_PATHS.COMMON.replace(":id", createdCommon.id));
    },
    [onSubCommonCreationModalClose, history],
  );

  return {
    isSubCommonCreationModalOpen,
    onSubCommonCreationModalOpen,
    onSubCommonCreationModalClose,
    onSubCommonCreate,
  };
};
