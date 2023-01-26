import { useCallback, useState } from "react";
import { useHistory } from "react-router";
import { ProposalsTypes, ROUTE_PATHS } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import { Proposal, ProposalWithHighlightedComment } from "@/shared/models";

interface Return {
  isProposalCreationModalOpen: boolean;
  initialProposalTypeForCreation: ProposalsTypes | null;
  onProposalCreationModalOpen: () => void;
  onProposalCreationModalClose: () => void;
  onCommonDelete: () => void;
  redirectToProposalPage: (
    proposal: Proposal | ProposalWithHighlightedComment,
  ) => void;
}

export const useProposalCreationModal = (): Return => {
  const history = useHistory();
  const {
    isShowing: isProposalCreationModalOpen,
    onOpen: onProposalCreationModalOpen,
    onClose: onProposalCreationModalClose,
  } = useModal(false);
  const [initialProposalTypeForCreation, setInitialProposalTypeForCreation] =
    useState<ProposalsTypes | null>(null);

  const redirectToProposalPage = useCallback(
    (payload: Proposal | ProposalWithHighlightedComment) => {
      history.push({
        pathname: ROUTE_PATHS.PROPOSAL_DETAIL.replace(":id", payload.id),
        state: {
          highlightedCommentId: (payload as ProposalWithHighlightedComment)
            ?.highlightedCommentId,
        },
      });
    },
    [],
  );

  const handleProposalCreationModalClose = useCallback(() => {
    onProposalCreationModalClose();
    setInitialProposalTypeForCreation(null);
  }, [onProposalCreationModalClose]);

  const onCommonDelete = useCallback(() => {
    setInitialProposalTypeForCreation(ProposalsTypes.DELETE_COMMON);
    onProposalCreationModalOpen();
  }, [onProposalCreationModalOpen]);

  return {
    isProposalCreationModalOpen,
    initialProposalTypeForCreation,
    onProposalCreationModalOpen,
    onProposalCreationModalClose: handleProposalCreationModalClose,
    onCommonDelete,
    redirectToProposalPage,
  };
};
