import React, { FC, useCallback, useEffect, useState } from "react";
import { CreateProposal } from "@/pages/OldCommon/interfaces";
import { ProposalService } from "@/services";
import { Image, Modal } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import { ProposalsTypes } from "@/shared/constants";
import { Loader } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import styles from "./JoinCircleModal.module.scss";

interface JoinCircleModalProps {
  payload: Omit<CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["data"], "type">;
  circleName: string;
  isShowing: boolean;
  onClose: () => void;
}

const JoinCircleModal: FC<JoinCircleModalProps> = (props) => {
  const { payload, circleName, isShowing, onClose } = props;
  const [proposalState, setProposalState] = useState({
    fetched: false,
    isLoading: false,
  });
  const [errorText, setErrorText] = useState("");

  const ContentEl = useCallback(() => {
    if (errorText) {
      return <ErrorText className={styles.error}>{errorText}</ErrorText>;
    }

    if (proposalState.isLoading) {
      return <Loader />;
    }

    return (
      <>
        <h2 className={styles.title}>Great news!</h2>
        <p className={styles.description}>
          Your application to join {circleName} has been submitted and is now
          awaiting approval according to the governance guidelines of this
          space. We will inform you of the outcome as soon as it is available.
        </p>
      </>
    );
  }, [circleName, JSON.stringify(proposalState), errorText]);

  useEffect(() => {
    if (!payload || proposalState.fetched || proposalState.isLoading) {
      return;
    }

    (async () => {
      setProposalState({
        fetched: false,
        isLoading: true,
      });
      setErrorText("");

      try {
        await ProposalService.createAssignProposal(payload);
        setProposalState({
          fetched: true,
          isLoading: false,
        });
      } catch (error) {
        setErrorText("Something went wrong");
        setProposalState({
          fetched: true,
          isLoading: false,
        });
      }
    })();
  }, [JSON.stringify(payload), JSON.stringify(proposalState)]);

  return (
    <Modal
      className={styles.modal}
      isShowing={isShowing}
      onClose={proposalState.isLoading ? emptyFunction : onClose}
      hideCloseButton={proposalState.isLoading}
      styles={{
        modalOverlay: styles.modalOverlay,
        modalWrapper: styles.modalWrapper,
      }}
    >
      <div className={styles.content}>
        <Image
          className={styles.image}
          src="/icons/add-proposal/illustrations-full-page-send.svg"
          alt="Send"
          placeholderElement={null}
          aria-hidden
        />
        <ContentEl />
      </div>
    </Modal>
  );
};

export default JoinCircleModal;
