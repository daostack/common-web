import { useCallback, useState } from "react";
import { CreateProposal } from "@/pages/OldCommon/interfaces";
import { ProposalsTypes } from "@/shared/constants";
import { useModal } from "@/shared/hooks";

interface State {
  circleName: string | null;
  payload: Omit<
    CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["data"],
    "type"
  > | null;
}

interface Return {
  circleNameToJoin: string | null;
  createAssignProposalJoinPayload: Omit<
    CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["data"],
    "type"
  > | null;
  isJoinCircleModalOpen: boolean;
  onJoinCircleModalOpen: (
    payload: Omit<CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["data"], "type">,
    circleName: string,
  ) => void;
  onJoinCircleModalClose: () => void;
}

export const useJoinCircleModal = (): Return => {
  const [joinCircleState, setJoinCircleState] = useState<State>({
    circleName: null,
    payload: null,
  });
  const {
    isShowing: isJoinCircleModalOpen,
    onOpen: onJoinCircleModalOpen,
    onClose: onJoinCircleModalClose,
  } = useModal(false);

  const handleJoinCircleModalOpen = useCallback(
    (
      payload: Omit<
        CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["data"],
        "type"
      >,
      circleName: string,
    ) => {
      setJoinCircleState({ circleName, payload });
      onJoinCircleModalOpen();
    },
    [onJoinCircleModalOpen],
  );

  const handleJoinCircleModalClose = useCallback(() => {
    onJoinCircleModalClose();
    setJoinCircleState({ circleName: null, payload: null });
  }, [onJoinCircleModalClose]);

  return {
    circleNameToJoin: joinCircleState.circleName,
    createAssignProposalJoinPayload: joinCircleState.payload,
    isJoinCircleModalOpen,
    onJoinCircleModalOpen: handleJoinCircleModalOpen,
    onJoinCircleModalClose: handleJoinCircleModalClose,
  };
};
