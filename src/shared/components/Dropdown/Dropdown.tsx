import React, { useState, FC } from "react";
import {
  Button as MenuButton,
  Menu,
  MenuItem,
  Wrapper as MenuWrapper,
  WrapperProps as MenuWrapperProps,
} from "react-aria-menubutton";
import classNames from "classnames";
import RightArrowIcon from "../../icons/rightArrow.icon";
import "./index.scss";

export interface Option {
  text: string;
  value: unknown;
}

interface DropdownProps {
  className?: string;
  value?: unknown;
  options: Option[];
  placeholder?: string;
  onSelect: (value: unknown) => void;
}

const Dropdown: FC<DropdownProps> = (props) => {
  const { className, value, options, placeholder, onSelect } = props;
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const handleSelection: MenuWrapperProps<HTMLElement>["onSelection"] = (
    value,
    event
  ) => {
    event.stopPropagation();
    onSelect(value);
  };

  const handleMenuToggle: MenuWrapperProps<HTMLElement>["onMenuToggle"] = ({
    isOpen,
  }) => {
    setIsOpen(isOpen);
  };

  return (
    <MenuWrapper
      className={classNames("custom-dropdown-wrapper", className)}
      onSelection={handleSelection}
      onMenuToggle={handleMenuToggle}
    >
      <MenuButton className="custom-dropdown-wrapper__menu-button">
        <span className="custom-dropdown-wrapper__placeholder">
          {selectedOption ? selectedOption.text : placeholder}
        </span>
        <RightArrowIcon
          className={classNames("custom-dropdown-wrapper__arrow-icon", {
            "custom-dropdown-wrapper__arrow-icon--opened": isOpen,
          })}
        />
      </MenuButton>
      <Menu className="custom-dropdown-wrapper__menu">
        <ul className="custom-dropdown-wrapper__menu-list">
          {options.map((option) => (
            <MenuItem
              key={String(option.value)}
              className={classNames("custom-dropdown-wrapper__menu-item", {
                "custom-dropdown-wrapper__menu-item--active":
                  option.value === selectedOption?.value,
              })}
              tag="li"
              value={option.value}
              text={option.text}
            >
              {option.text}
            </MenuItem>
          ))}
        </ul>
      </Menu>
    </MenuWrapper>
  );
};

export default Dropdown;
