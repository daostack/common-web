import { SelectType } from '@/shared/interfaces/Select';
import { Circle } from '@/shared/models';
import React, { ReactElement } from 'react';
import Select, { MultiValue, StylesConfig, SingleValue } from 'react-select';
import {CircleSelectOption} from './CircleSelectOption';
import { ErrorText } from "@/shared/components/Form/ErrorText";
import './index.scss';

type CircleSelectType = SelectType<Circle>;

interface CirclesSelectProps {
  placeholder?: string;
  options: CircleSelectType[];
  handleChange: (data: MultiValue<CircleSelectType> | SingleValue<CircleSelectType>) => void;
  value: CircleSelectType | CircleSelectType[] | null;
  selectStyles?: StylesConfig<CircleSelectType>;
  error?: string;
  onBlur: (e: React.FocusEvent<any, Element>) => void;
}

export const CirclesSelect = ({options, handleChange, value, placeholder, error, onBlur}: CirclesSelectProps): ReactElement => {
  
  return (
    <div className="circle-select">
      <Select
        placeholder={placeholder}
        closeMenuOnSelect={false}
        isClearable
        isMulti
        value={value}
        options={options}
        onChange={handleChange}
        onBlur={onBlur}
        hideSelectedOptions={false}
        menuPortalTarget={document.body}
        styles={{
          menu: (provided) => ({ ...provided, zIndex: 10000}),
          menuPortal: (provided) => ({...provided, zIndex: 10000}),
          control: (provided) => ({
            ...provided,
            ...(error && {borderColor: '#ef5456'}),
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#d2d8ff'
          })
        }}
        components={{ Option: CircleSelectOption }}
      />
      {Boolean(error) && (
        <ErrorText>{error}</ErrorText>
      )}
    </div>
  )
};
