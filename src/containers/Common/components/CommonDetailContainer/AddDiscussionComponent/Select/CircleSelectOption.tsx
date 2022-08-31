import React from 'react';
import { OptionProps } from 'react-select';
import { Checkbox } from "@/shared/components/Form";
import { SelectType } from '@/shared/interfaces/Select';
import { Circle } from '@/shared/models';
import './index.scss';

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
          onChange={(event) => event.stopPropagation()}
          onLabelClick={(event) => event.preventDefault()}
          className="circle-select-option"
          id={label}
          name={label}
          label={label}
          checked={isSelected}
        />
      </div>
    );
};