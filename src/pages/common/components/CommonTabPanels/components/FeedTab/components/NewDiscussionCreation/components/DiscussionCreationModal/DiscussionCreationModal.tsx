import React, { FC } from "react";
import { NewDiscussionCreationFormValues } from "@/shared/interfaces";
import { Circles } from "@/shared/models";
import { CommonMobileModal } from "../../../../../../../CommonMobileModal";
import { DiscussionCreationForm } from "../DiscussionCreationForm";
import styles from "./DiscussionCreationModal.module.scss";

type FormValues = NewDiscussionCreationFormValues;

interface DiscussionCreationModalProps {
  initialValues: FormValues;
  governanceCircles: Circles;
  userCircleIds: string[];
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  commonImage: string;
  commonName: string;
  commonId: string;
  edit?: boolean;
}

const DiscussionCreationModal: FC<DiscussionCreationModalProps> = (props) => {
  const {
    initialValues,
    governanceCircles,
    userCircleIds,
    onSubmit,
    onCancel,
    isLoading = false,
    commonImage,
    commonName,
    edit,
    commonId,
  } = props;

  return (
    <CommonMobileModal
      isOpen
      onClose={onCancel}
      isClosingEnabled={!isLoading}
      commonImage={commonImage}
      commonName={commonName}
    >
      <h4 className={styles.title}>New discussion</h4>
      <DiscussionCreationForm
        className={styles.form}
        initialValues={initialValues}
        governanceCircles={governanceCircles}
        userCircleIds={userCircleIds}
        onSubmit={onSubmit}
        isLoading={isLoading}
        styles={{
          header: styles.discussionCreationFormHeader,
          buttonsWrapper: styles.buttonsWrapper,
        }}
        edit={edit}
        commonId={commonId}
      />
    </CommonMobileModal>
  );
};

export default DiscussionCreationModal;
