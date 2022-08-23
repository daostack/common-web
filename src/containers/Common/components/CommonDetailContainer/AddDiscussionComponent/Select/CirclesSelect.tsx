import { SelectType } from '@/shared/interfaces/Select';
import { Circle } from '@/shared/models';
import React, { ReactElement } from 'react';
import Select, { MultiValue, StylesConfig, SingleValue } from 'react-select';
import {CircleSelectOption} from './CircleSelectOption';

type CircleSelectType = SelectType<Circle>;

interface CirclesSelectProps {
  placeholder?: string;
  options: CircleSelectType[];
  handleChange: (data: MultiValue<CircleSelectType> | SingleValue<CircleSelectType>) => void;
  value: CircleSelectType | CircleSelectType[] | null;
  selectStyles?: StylesConfig<CircleSelectType>;
}

export const CirclesSelect = ({options, handleChange, value,placeholder}: CirclesSelectProps): ReactElement => {
  
  return (
    <Select
      placeholder={placeholder}
      closeMenuOnSelect={false}
      isClearable
      isMulti
      value={value}
      options={options}
      onChange={handleChange}
      hideSelectedOptions={false}
      menuPortalTarget={document.body}
      styles={{
        menu: (style) => ({ ...style, zIndex: 10000}),
        menuPortal: (style) => ({...style, zIndex: 10000})
      }}
      components={{ Option: CircleSelectOption }}
    />
  )
};
