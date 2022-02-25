import React, { useState, FC, useMemo } from "react";
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

export interface Styles {
  menuButton?: string;
  placeholder?: string;
  arrowIcon?: string;
  menu?: string;
  menuList?: string;
}

export interface Option {
  text: string;
  value: unknown;
}

export interface DropdownProps {
  className?: string;
  value?: unknown;
  options: Option[];
  placeholder?: string;
  onSelect: (value: unknown) => void;
  menuButtonText?: string;
  styles?: Styles;
  label?: string;
}

const Dropdown: FC<DropdownProps> = (props) => {
  const {
    className,
    value,
    options,
    placeholder,
    onSelect,
    menuButtonText,
    styles,
    label,
  } = props;
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
      {label && (
        <div className="custom-dropdown-wrapper__label-wrapper">
          <span className="custom-dropdown-wrapper__label">{label}</span>
        </div>
      )}
      <MenuButton
        className={classNames(
          "custom-dropdown-wrapper__menu-button",
          styles?.menuButton
        )}
      >
        <span
          className={classNames(
            "custom-dropdown-wrapper__placeholder",
            styles?.placeholder
          )}
        >
          {menuButtonText ??
            (selectedOption ? selectedOption.text : placeholder)}
        </span>
        <RightArrowIcon
          className={classNames(
            "custom-dropdown-wrapper__arrow-icon",
            styles?.arrowIcon,
            {
              "custom-dropdown-wrapper__arrow-icon--opened": isOpen,
            }
          )}
        />
      </MenuButton>
      <Menu
        className={classNames("custom-dropdown-wrapper__menu", styles?.menu)}
      >
        <ul
          className={classNames(
            "custom-dropdown-wrapper__menu-list",
            styles?.menuList
          )}
        >
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
