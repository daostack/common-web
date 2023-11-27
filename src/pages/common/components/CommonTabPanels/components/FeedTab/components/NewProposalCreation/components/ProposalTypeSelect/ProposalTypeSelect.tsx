import React from "react";
import Select, { components, DropdownIndicatorProps } from "react-select";
import { useFormikContext } from "formik";
import { ProposalsTypes } from "@/shared/constants";
import { RightArrowThinIcon } from "@/shared/icons";
import { NewProposalCreationFormValues } from "@/shared/interfaces";
import useThemeColor from "@/shared/hooks/useThemeColor";
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
      isDisabled: commonBalance === 0,
    },
  ];

  return options;
};

const ProposalTypeSelect = ({ commonBalance }: ProposalTypeSelectProps) => {
  const { values, setFieldValue, handleBlur, touched, errors } =
  useFormikContext<NewProposalCreationFormValues>();
  
  const { getThemeColor } = useThemeColor();
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
        styles={selectorStyles(hasError, getThemeColor)}
        components={{
          DropdownIndicator,
        }}
      />
    </div>
  );
};

export default ProposalTypeSelect;
