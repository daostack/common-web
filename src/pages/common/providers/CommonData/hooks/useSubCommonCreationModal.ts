import { useCallback } from "react";
import { useHistory } from "react-router";
import { ROUTE_PATHS } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import { Common, Governance } from "@/shared/models";

interface Return {
  isSubCommonCreationModalOpen: boolean;
  areNonCreatedProjectsLeft: boolean;
  onSubCommonCreationModalOpen: () => void;
  onSubCommonCreationModalClose: () => void;
  onSubCommonCreate: (common: Common) => void;
}

export const useSubCommonCreationModal = (
  circles: Governance["circles"],
  subCommons: Common[],
): Return => {
  const history = useHistory();
  const {
    isShowing: isSubCommonCreationModalOpen,
    onOpen: onSubCommonCreationModalOpen,
    onClose: onSubCommonCreationModalClose,
  } = useModal(false);
  const areNonCreatedProjectsLeft = Object.values(circles).some(
    (circle) =>
      !subCommons.some(
        (subCommon) => subCommon.directParent?.circleId === circle.id,
      ),
  );

  const onSubCommonCreate = useCallback(
    (createdCommon: Common) => {
      onSubCommonCreationModalClose();
      history.push(ROUTE_PATHS.COMMON.replace(":id", createdCommon.id));
    },
    [onSubCommonCreationModalClose, history],
  );

  return {
    isSubCommonCreationModalOpen,
    areNonCreatedProjectsLeft,
    onSubCommonCreationModalOpen,
    onSubCommonCreationModalClose,
    onSubCommonCreate,
  };
};
