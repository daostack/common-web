import React, { FC, PropsWithChildren, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ProposalService } from "@/services";
import { Modal } from "@/shared/components";
import { Colors, ProposalsTypes } from "@/shared/constants";
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
  isAssignCircle: false,
  step: JoinProjectSteps.FORM,
  errorText: "",
};

const JoinProjectModal: FC<PropsWithChildren<JoinProjectModalProps>> = (
  props,
) => {
  const { isShowing, onClose, governance, common } = props;
  const [state, setState] = useState(INITIAL_STATE);
  const user = useSelector(selectUser());
  const userName = getUserName(user);
  const userId = user?.uid;

  const createMemberAdmittanceProposal = async (payload) => {
    try {
      setState({
        ...INITIAL_STATE,
        isLoading: true,
        isAssignCircle: false,
        step: JoinProjectSteps.CREATION,
      });
      await ProposalService.createMemberAdmittanceProposal({
        args: {
          ...payload,
          title: `Membership request from ${userName}`,
          feeMonthly: null,
          feeOneTime: null,
        },
      });
      setState({
        ...INITIAL_STATE,
        isLoading: false,
        isAssignCircle: false,
        step: JoinProjectSteps.CREATION,
      });
    } catch (err) {
      setState({
        isLoading: false,
        isAssignCircle: false,
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
          isAssignCircle: true,
          step: JoinProjectSteps.CREATION,
        });

        const circleId = governance.circles[0].id;
        const circleName = governance.circles[0].name;

        await ProposalService.createAssignProposal({
          args: {
            ...payload,
            commonId: common.id,
            circleId,
            userId,
            title: `Request to join ${circleName} circle by ${userName}`,
          },
        });
        setState({
          ...INITIAL_STATE,
          isLoading: false,
          isAssignCircle: true,
          step: JoinProjectSteps.CREATION,
        });
      } catch (err) {
        setState({
          isLoading: false,
          isAssignCircle: true,
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

      if (governance.proposals[ProposalsTypes.MEMBER_ADMITTANCE]) {
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
      onClose={state.isLoading ? emptyFunction : onClose}
      hideCloseButton={state.isLoading}
      title={
        state.step === JoinProjectSteps.FORM ? "Request to Join Project" : ""
      }
      closeColor={Colors.black}
      closeIconSize={24}
      styles={{
        header: styles.modalHeader,
        content: styles.modalContent,
      }}
    >
      {state.step === JoinProjectSteps.FORM ? (
        <JoinProjectForm onClose={onClose} requestToJoin={requestToJoin} />
      ) : (
        <JoinProjectCreation
          isLoading={state.isLoading}
          isAssignCircle={state.isAssignCircle}
          errorText={state.errorText}
        />
      )}
    </Modal>
  );
};

export default JoinProjectModal;
