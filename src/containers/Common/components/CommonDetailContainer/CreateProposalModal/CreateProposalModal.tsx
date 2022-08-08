import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { Modal } from "@/shared/components";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { useZoomDisabling } from "@/shared/hooks";
import { ModalProps } from "@/shared/interfaces";
import { Common, CommonMember, Governance, Proposal } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { AssignCircleStage } from "./AssignCircleStage";
import { Error } from "./Error";
import { RemoveCircleStage } from "./RemoveCircleStage";
import { FundsAllocationStage } from "./FundsAllocationStage";
import { ProposalTypeSelection } from "./ProposalTypeSelection";
import { CreateProposalStage } from "./constants";
import { CreateProposalContext, CreateProposalContextValue } from "./context";
import { GoBackHandler } from "./types";
import "./index.scss";

interface CreateProposalModalProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  common: Common;
  governance: Governance;
  commonMember: CommonMember;
  redirectToProposal: (proposal: Proposal) => void;
}

const CreateProposalModal: FC<CreateProposalModalProps> = (props) => {
  const {
    common,
    governance,
    isShowing,
    onClose,
    commonMember,
    redirectToProposal,
  } = props;
  const { disableZoom, resetZoom } = useZoomDisabling({
    shouldDisableAutomatically: false,
  });
  const [stage, setStage] = useState(CreateProposalStage.ProposalTypeSelection);
  const [title, setTitle] = useState<ReactNode>("Create New Proposal");
  const [onGoBack, setOnGoBack] = useState<GoBackHandler>();
  const [shouldShowClosePrompt, setShouldShowClosePrompt] = useState(false);
  const [shouldBeOnFullHeight, setShouldBeOnFullHeight] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const setGoBackHandler = useCallback((handler: GoBackHandler | null) => {
    setOnGoBack(() => handler ?? undefined);
  }, []);

  const goToProposalTypeSelectionStage = useCallback(() => {
    setStage(CreateProposalStage.ProposalTypeSelection);
    setGoBackHandler(onClose);
  }, [setGoBackHandler, onClose]);

  const handleError = useCallback((errorText: string) => {
    setErrorText(errorText);
  }, []);

  const handleProposalTypeSelectionFinish = useCallback(
    (proposalType: ProposalsTypes) => {
      if (proposalType === ProposalsTypes.ASSIGN_CIRCLE) {
        setStage(CreateProposalStage.AssignCircle);
      }
      if (proposalType === ProposalsTypes.FUNDS_ALLOCATION) {
        setStage(CreateProposalStage.FundsAllocation);
      }
      if (proposalType === ProposalsTypes.REMOVE_CIRCLE) {
        setStage(CreateProposalStage.RemoveCircle);
      }
    },
    []
  );

  const handleProposalCreationFinish = useCallback(
    (proposal?: Proposal) => {
      onClose();

      if (proposal) {
        redirectToProposal(proposal);
      }
    },
    [onClose, redirectToProposal]
  );

  const handleErrorFinish = useCallback(() => {
    setErrorText(null);
    setStage(CreateProposalStage.ProposalTypeSelection);
  }, []);

  useEffect(() => {
    if (isShowing) {
      disableZoom();
      return;
    }

    setErrorText(null);
    setStage(CreateProposalStage.ProposalTypeSelection);
    resetZoom();
  }, [isShowing, disableZoom, resetZoom]);

  const contextValue = useMemo<CreateProposalContextValue>(
    () => ({
      setTitle,
      setShouldShowClosePrompt,
      setShouldBeOnFullHeight,
      setOnGoBack: setGoBackHandler,
      onError: handleError,
    }),
    [setGoBackHandler, handleError]
  );

  const renderContent = () => {
    if (!isMobileView && errorText !== null) {
      return <Error errorText={errorText} onFinish={handleErrorFinish} />;
    }

    switch (stage) {
      case CreateProposalStage.ProposalTypeSelection:
        return (
          <ProposalTypeSelection
            governance={governance}
            commonMember={commonMember}
            onFinish={handleProposalTypeSelectionFinish}
          />
        );
      case CreateProposalStage.AssignCircle:
        return (
          <AssignCircleStage
            common={common}
            governance={governance}
            commonMember={commonMember}
            onFinish={handleProposalCreationFinish}
            onGoBack={goToProposalTypeSelectionStage}
          />
        );
      case CreateProposalStage.RemoveCircle:
        return (
          <RemoveCircleStage
            common={common}
            governance={governance}
            commonMember={commonMember}
            onFinish={handleProposalCreationFinish}
            onGoBack={goToProposalTypeSelectionStage}
          />
        );
      case CreateProposalStage.FundsAllocation:
        return (
          <FundsAllocationStage
            common={common}
            governance={governance}
            onFinish={handleProposalCreationFinish}
            onGoBack={goToProposalTypeSelectionStage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      className="create-proposal-modal"
      isShowing={isShowing}
      title={title}
      onClose={onClose}
      onGoBack={onGoBack}
      closePrompt={shouldShowClosePrompt}
      mobileFullScreen
      fullHeight={shouldBeOnFullHeight}
    >
      <CreateProposalContext.Provider value={contextValue}>
        {renderContent()}
        {isMobileView && errorText !== null && (
          <Error errorText={errorText} onFinish={handleErrorFinish} />
        )}
      </CreateProposalContext.Provider>
    </Modal>
  );
};

export default CreateProposalModal;
