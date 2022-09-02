import React from 'react';
import { OptionProps } from 'react-select';
import { Checkbox } from "@/shared/components/Form";
import { SelectType } from '@/shared/interfaces/Select';
import { Circle } from '@/shared/models';
import './index.scss';
import classNames from 'classnames';

export const CircleSelectOption:  React.FC<OptionProps<SelectType<Circle>>> = (props) => {
    const {
      isSelected,
      innerProps,
      label,
      isDisabled,
    } = props;
    return (
      <div
        {...innerProps}
      >
        <Checkbox
          onChange={(event) => event.stopPropagation()}
          onLabelClick={(event) => event.preventDefault()}
          className={classNames("circle-select__option", {
            'circle-select__option--disabled': isDisabled,
          })}
          id={label}
          name={label}
          label={label}
          styles={{
            label: isDisabled ? "circle-select--disabled" : '',
            checkbox: isDisabled ? "circle-select--disabled" : ''
          }}
          checked={isSelected}
        />
      </div>
    );
};