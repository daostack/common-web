import React, { FC } from "react";
import classNames from "classnames";
import {
  TextEditor,
  TextField,
  UploadFiles,
} from "@/shared/components/Form/Formik";
import { ProposalTypeSelectOption, ProposalsTypes } from "@/shared/constants";
import { Circles, Governance } from "@/shared/models";
import { MAX_PROPOSAL_TITLE_LENGTH } from "../../constants";
import { AddRecipient } from "../AddRecipient";
import { ProposalTypeSelect } from "../ProposalTypeSelect";
import { VotingSettings } from "../VotingSettings";
import styles from "./ProposalForm.module.scss";

interface ProposalFormProps {
  className?: string;
  disabled?: boolean;
  selectedProposalType: ProposalTypeSelectOption;
  governanceCircles: Circles;
  governance: Governance;
}

const ProposalForm: FC<ProposalFormProps> = (props) => {
  const {
    className,
    disabled = false,
    governanceCircles,
    selectedProposalType,
    governance,
  } = props;

  return (
    <div className={classNames(styles.container, className)}>
      <ProposalTypeSelect />
      <VotingSettings
        governance={governance}
        governanceCircles={governanceCircles}
        proposalSelectedType={selectedProposalType.value}
      />

      <TextField
        className={styles.field}
        id="proposalTitle"
        name="title"
        label="Proposal Title"
        maxLength={MAX_PROPOSAL_TITLE_LENGTH}
        countAsHint
        disabled={disabled}
        styles={{
          labelWrapper: styles.textFieldLabelWrapper,
          hint: styles.textFieldHint,
        }}
      />
      <TextEditor
        className={styles.field}
        name="content"
        label="Content"
        optional
        disabled={disabled}
      />
      <UploadFiles name="images" disabled={disabled} />
      {selectedProposalType.value === ProposalsTypes.FUNDS_ALLOCATION && (
        <AddRecipient />
      )}
    </div>
  );
};

export default ProposalForm;
