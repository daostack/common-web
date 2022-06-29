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
import { ScreenSize } from "@/shared/constants";
import { useZoomDisabling } from "@/shared/hooks";
import { ModalProps } from "@/shared/interfaces";
import { Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { ProposalTypeSelection } from "./ProposalTypeSelection";
import { CreateProposalStage } from "./constants";
import { CreateProposalContext, CreateProposalContextValue } from "./context";
import { GoBackHandler } from "./types";
import "./index.scss";

interface CreateProposalModalProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  governance: Governance;
}

const CreateProposalModal: FC<CreateProposalModalProps> = (props) => {
  const { isShowing, onClose } = props;
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
    switch (stage) {
      case CreateProposalStage.ProposalTypeSelection:
        return <ProposalTypeSelection />;
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
      </CreateProposalContext.Provider>
    </Modal>
  );
};

export default CreateProposalModal;
