import React from 'react';
import { OptionProps } from 'react-select';
import { Checkbox } from "@/shared/components/Form";
import { SelectType } from '@/shared/interfaces/Select';
import { Circle } from '@/shared/models';

export const CircleSelectOption:  React.FC<OptionProps<SelectType<Circle>>> = (props) => {
    const {
      isSelected,
      innerProps,
      label,
    } = props;
    return (
      <div
        {...innerProps}
      >
        <Checkbox
          disabled
          className="create-common-user-acknowledgment__terms-checkbox"
          id="termsAgreement"
          name="termsAgreement"
          label={label}
          checked={isSelected}
          styles={{
            label: "create-common-user-acknowledgment__terms-checkbox-label",
          }}
        />
      </div>
    );
};