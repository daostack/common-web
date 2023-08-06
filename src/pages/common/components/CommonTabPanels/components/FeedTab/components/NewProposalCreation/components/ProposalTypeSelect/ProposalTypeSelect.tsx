import React from "react";
import Select, { components, DropdownIndicatorProps } from "react-select";
import { useFormikContext } from "formik";
import {
  PROPOSAL_TYPE_SELECT_OPTIONS,
  ProposalsTypes,
} from "@/shared/constants";
import { RightArrowThinIcon } from "@/shared/icons";
import { NewProposalCreationFormValues } from "@/shared/interfaces";
import { selectorStyles } from "./selectorStyles";
import styles from "./ProposalTypeSelect.module.scss";

interface ProposalTypeSelectProps {
  commonBalance: number;
}

const DropdownIndicator = (props: DropdownIndicatorProps<any, true>) => {
  return (
    <components.DropdownIndicator {...props}>
      <RightArrowThinIcon className={styles.selectDropdownIcon} />
    </components.DropdownIndicator>
  );
};

const getProposalOptions = (commonBalance: number) => {
  const options = [
    {
      label: "Survey",
      value: ProposalsTypes.SURVEY,
    },
    {
      label: "Fund allocation",
      value: ProposalsTypes.FUNDS_ALLOCATION,
    },
  ];
  options[1]["isDisabled"] = commonBalance === 0;
  return options;
};

const ProposalTypeSelect = ({ commonBalance }: ProposalTypeSelectProps) => {
  const { values, setFieldValue, handleBlur, touched, errors } =
    useFormikContext<NewProposalCreationFormValues>();
  const hasError = Boolean(touched.proposalType && errors.proposalType);

  return (
    <div className={styles.container}>
      <label className={styles.label}>Proposal Type</label>
      <Select
        closeMenuOnSelect
        value={values.proposalType}
        options={getProposalOptions(commonBalance)}
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
