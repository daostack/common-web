import { useCallback, useState } from "react";
import { useHistory } from "react-router";
import { CommonFeedService } from "@/services";
import { ProposalsTypes, ROUTE_PATHS } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import {
  CommonFeedType,
  Proposal,
  ProposalWithHighlightedComment,
} from "@/shared/models";

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
    async (payload: Proposal | ProposalWithHighlightedComment) => {
      const proposalFeedItem =
        await CommonFeedService.getCommonFeedItemWithSnapshot(
          payload.data.args.commonId,
          payload.id,
          CommonFeedType.Proposal,
        );
      const url = `${ROUTE_PATHS.COMMON.replace(
        ":id",
        payload.data.args.commonId,
      )}?item=${proposalFeedItem?.commonFeedItem.id}`;
      history.push(url);
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
