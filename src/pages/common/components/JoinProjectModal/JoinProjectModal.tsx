import React, { FC, PropsWithChildren, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ProposalService } from "@/services";
import { Modal } from "@/shared/components";
import { Colors, ProposalsTypes } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Common, Governance } from "@/shared/models";
import { emptyFunction, getUserName } from "@/shared/utils";
import { JoinProjectCreation, JoinProjectForm } from "./components";
import styles from "./JoinProjectModal.module.scss";

interface JoinProjectModalProps {
  isShowing: boolean;
  onClose: () => void;
  common: Common;
  governance: Governance;
}

enum JoinProjectSteps {
  FORM = "FORM",
  CREATION = "CREATION",
}

const INITIAL_STATE = {
  isLoading: false,
  step: JoinProjectSteps.FORM,
  errorText: "",
};

const JoinProjectModal: FC<PropsWithChildren<JoinProjectModalProps>> = (
  props,
) => {
  const { isShowing, onClose, governance, common } = props;
  const isTabletView = useIsTabletView();
  const [state, setState] = useState(INITIAL_STATE);
  const user = useSelector(selectUser());
  const userName = getUserName(user);
  const userId = user?.uid;
  const isJoinMemberAdmittanceRequest = Boolean(
    governance.proposals[ProposalsTypes.MEMBER_ADMITTANCE],
  );
  const modalTitle = isJoinMemberAdmittanceRequest
    ? "Request to Join Project"
    : "Join Project";

  const handleClose = () => {
    setState(INITIAL_STATE);
    onClose();
  };

  const createMemberAdmittanceProposal = async (payload) => {
    try {
      setState({
        ...INITIAL_STATE,
        isLoading: true,
        step: JoinProjectSteps.CREATION,
      });
      await ProposalService.createMemberAdmittanceProposal(payload);
      setState({
        ...INITIAL_STATE,
        isLoading: false,
        step: JoinProjectSteps.CREATION,
      });
    } catch (err) {
      setState({
        isLoading: false,
        errorText: "Something went wrong",
        step: JoinProjectSteps.CREATION,
      });
    }
  };

  const createAssignProposal = useCallback(
    async (payload) => {
      try {
        if (!governance.circles?.[0] || !userId) {
          return;
        }
        setState({
          ...INITIAL_STATE,
          isLoading: true,
          step: JoinProjectSteps.CREATION,
        });

        await ProposalService.createAssignProposal(payload);
        setState({
          ...INITIAL_STATE,
          isLoading: false,
          step: JoinProjectSteps.CREATION,
        });
      } catch (err) {
        setState({
          isLoading: false,
          errorText: "Something went wrong",
          step: JoinProjectSteps.CREATION,
        });
      }
    },
    [governance, userId, userName],
  );

  const requestToJoin = useCallback(
    async (message) => {
      if (!common || !userId || !governance.circles?.[0]) {
        return;
      }

      const circleId = governance.circles[0].id;
      const circleName = governance.circles[0].name;

      const payload = {
        commonId: common.id,
        description: message,
        images: [],
        files: [],
        links: [],
      };

      if (isJoinMemberAdmittanceRequest) {
        await createMemberAdmittanceProposal({
          args: {
            ...payload,
            title: `Membership request from ${userName}`,
            feeMonthly: null,
            feeOneTime: null,
          },
        });
      } else {
        await createAssignProposal({
          args: {
            ...payload,
            commonId: common.id,
            circleId,
            userId,
            title: `Request to join ${circleName} circle by ${userName}`,
          },
        });
      }
    },
    [governance, common, userId],
  );

  return (
    <Modal
      className={styles.modal}
      isShowing={isShowing}
      onClose={state.isLoading ? emptyFunction : handleClose}
      hideCloseButton={state.isLoading || (isTabletView && !state.errorText)}
      title={state.step === JoinProjectSteps.FORM ? modalTitle : ""}
      closeColor={Colors.black}
      closeIconSize={24}
      mobileFullScreen
      styles={{
        header: styles.modalHeader,
        content: styles.modalContent,
      }}
    >
      {state.step === JoinProjectSteps.FORM ? (
        <JoinProjectForm
          onClose={handleClose}
          requestToJoin={requestToJoin}
          isJoinMemberAdmittanceRequest={isJoinMemberAdmittanceRequest}
        />
      ) : (
        <JoinProjectCreation
          isLoading={state.isLoading}
          isJoinMemberAdmittanceRequest={isJoinMemberAdmittanceRequest}
          errorText={state.errorText}
          onClose={handleClose}
        />
      )}
    </Modal>
  );
};

export default JoinProjectModal;
