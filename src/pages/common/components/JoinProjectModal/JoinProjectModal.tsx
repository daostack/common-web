import React, { FC, PropsWithChildren, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { GovernanceService, ProposalService } from "@/services";
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
  onRequestCreated: () => void;
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
  const { isShowing, onClose, governance, common, onRequestCreated } = props;
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

  const createMemberAdmittanceProposal = useCallback(async (payload) => {
    try {
      setState({
        ...INITIAL_STATE,
        isLoading: true,
        step: JoinProjectSteps.CREATION,
      });
      await ProposalService.createMemberAdmittanceProposal(payload);
      onRequestCreated();
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
  }, []);

  const createAssignProposal = useCallback(async (payload) => {
    try {
      setState({
        ...INITIAL_STATE,
        isLoading: true,
        step: JoinProjectSteps.CREATION,
      });

      await ProposalService.createAssignProposal(payload);
      onRequestCreated();
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
  }, []);

  const requestToJoin = useCallback(
    async (message) => {
      if (!common || !userId || !governance.circles?.[0]) {
        return;
      }

      const commonId = isJoinMemberAdmittanceRequest
        ? common.id
        : common.directParent?.commonId;

      const commonGovernanceInfo = (
        common.directParent
          ? await GovernanceService.getGovernanceByCommonId(commonId as string)
          : governance
      ) as Governance;
      const governanceCircles = Object.values(commonGovernanceInfo.circles);
      const circleId = common.directParent?.circleId;
      const circleName = governanceCircles.find(
        ({ id }) => id === circleId,
      )?.name;

      const payload = {
        commonId,
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
            commonId,
            userId,
            circleId,
            title: `Request to join ${circleName} circle by ${userName}`,
          },
        });
      }
    },
    [governance, common.id, common.directParent?.commonId, userId],
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
        headerWrapper: styles.modalHeaderWrapper,
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
