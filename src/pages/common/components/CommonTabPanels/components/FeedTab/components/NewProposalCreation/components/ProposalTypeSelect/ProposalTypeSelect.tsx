import React, { FC } from "react";
import Select, { components, DropdownIndicatorProps } from "react-select";
import { useFormikContext } from "formik";
import { PROPOSAL_TYPE_SELECT_OPTIONS } from "@/shared/constants";
import { RightArrowThinIcon } from "@/shared/icons";
import { NewProposalCreationFormValues } from "@/shared/interfaces";
import { selectorStyles } from "./selectorStyles";
import styles from "./ProposalTypeSelect.module.scss";

const DropdownIndicator = (props: DropdownIndicatorProps<any, true>) => {
  return (
    <components.DropdownIndicator {...props}>
      <RightArrowThinIcon className={styles.selectDropdownIcon} />
    </components.DropdownIndicator>
  );
};

const ProposalTypeSelect: FC = () => {
  const { values, setFieldValue, handleBlur, touched, errors } =
    useFormikContext<NewProposalCreationFormValues>();
  const hasError = Boolean(touched.proposalType && errors.proposalType);

  return (
    <div className={styles.container}>
      <label className={styles.label}>Proposal Type</label>
      <Select
        closeMenuOnSelect
        value={values.proposalType}
        options={PROPOSAL_TYPE_SELECT_OPTIONS}
        onChange={(selectedValue) => {
          setFieldValue("proposalType", selectedValue);
        }}
        onBlur={handleBlur("proposalType")}
        hideSelectedOptions={false}
        styles={selectorStyles(hasError)}
        components={{
          DropdownIndicator,
        }}
      />
    </div>
  );
};

export default ProposalTypeSelect;
