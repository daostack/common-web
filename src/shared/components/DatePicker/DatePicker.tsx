import React, { useRef, FC } from "react";
import classNames from "classnames";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";
import CalendarIcon from "@/shared/icons/calendar.icon";
import { DateFormat } from "@/shared/models";
import { ButtonIcon } from "../ButtonIcon";
import "./index.scss";

interface Styles {
  label?: string;
}

interface DatePickerProps extends ReactDatePickerProps {
  label?: string;
  styles?: Styles;
}

const DatePicker: FC<DatePickerProps> = (props) => {
  const { label, styles, ...restProps } = props;
  const datePickerRef = useRef<ReactDatePicker>(null);
  const id = restProps.id || restProps.name;
  const className = classNames("custom-date-picker", restProps.className);

  const handleCalendarIconClick = () => {
    datePickerRef.current?.setOpen(true);
  };

  return (
    <div className={className}>
      {label && (
        <label
          className={classNames("custom-date-picker__label", styles?.label)}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className="custom-date-picker__date-picker-wrapper">
        <ReactDatePicker
          dateFormat={DateFormat.ShortSecondary}
          placeholderText="00/00/00"
          {...restProps}
          id={id}
          className="custom-date-picker__date-picker"
          ref={datePickerRef}
        />
        <ButtonIcon onClick={handleCalendarIconClick}>
          <CalendarIcon className="custom-date-picker__calendar-icon" />
        </ButtonIcon>
      </div>
    </div>
  );
};

export default DatePicker;
