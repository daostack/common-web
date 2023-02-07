import React, { FC } from "react";
import { NewProposalCreationFormValues } from "@/shared/interfaces";
import { Circles, Governance } from "@/shared/models";
import { CommonMobileModal } from "../../../../../../../CommonMobileModal";
import { ProposalCreationForm } from "../ProposalCreationForm";
import styles from "./ProposalCreationModal.module.scss";

type FormValues = NewProposalCreationFormValues;

interface ProposalCreationModalProps {
  initialValues: FormValues;
  governanceCircles: Circles;
  userCircleIds: string[];
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  commonImage: string;
  commonName: string;
  governance: Governance;
}

const ProposalCreationModal: FC<ProposalCreationModalProps> = (props) => {
  const {
    initialValues,
    governanceCircles,
    userCircleIds,
    onSubmit,
    onCancel,
    isLoading = false,
    commonImage,
    commonName,
    governance,
  } = props;

  return (
    <CommonMobileModal
      isOpen
      onClose={onCancel}
      isClosingEnabled={!isLoading}
      commonImage={commonImage}
      commonName={commonName}
    >
      <h4 className={styles.title}>New Proposal</h4>
      <ProposalCreationForm
        className={styles.form}
        initialValues={initialValues}
        governanceCircles={governanceCircles}
        governance={governance}
        userCircleIds={userCircleIds}
        onSubmit={onSubmit}
        isLoading={isLoading}
        styles={{
          header: styles.discussionCreationFormHeader,
          buttonsWrapper: styles.buttonsWrapper,
        }}
      />
    </CommonMobileModal>
  );
};

export default ProposalCreationModal;
