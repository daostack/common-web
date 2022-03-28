import React, {
  useRef,
  useState,
  CSSProperties,
  FC,
  ReactNode,
  RefObject,
} from "react";
import {
  Button as MenuButton,
  Menu,
  MenuItem,
  Wrapper as MenuWrapper,
  WrapperProps as MenuWrapperProps,
} from "react-aria-menubutton";
import classNames from "classnames";
import RightArrowIcon from "../../icons/rightArrow.icon";
import { GlobalOverlay } from "../GlobalOverlay";
import "./index.scss";

export interface Styles {
  menuButton?: string;
  placeholder?: string;
  arrowIcon?: string;
  menu?: string;
  menuList?: string;
  menuItem?: string;
}

export interface Option {
  text: ReactNode;
  searchText?: string;
  value: unknown;
  className?: string;
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
  shouldBeFixed?: boolean;
  menuButton?: ReactNode;
}

const getFixedMenuStyles = (
  ref: RefObject<HTMLElement>,
  menuRef: HTMLUListElement | null
): CSSProperties | undefined => {
  if (!ref.current || !menuRef) {
    return;
  }

  const { top, left, height } = ref.current.getBoundingClientRect();
  const menuRect = menuRef.getBoundingClientRect();
  const bottom = top + height + menuRect.height;
  const styles: CSSProperties = {
    left,
    top: top + height,
  };

  if (window.innerHeight < bottom) {
    styles.top = top - menuRect.height;
  }
  if (styles.top && styles.top < 0) {
    styles.top = 0;
    styles.bottom = 0;
    styles.maxHeight = "100%";
  }

  return styles;
};

const getMenuStyles = (
  ref: RefObject<HTMLElement>,
  menuRef: HTMLUListElement | null,
  shouldBeFixed?: boolean
): CSSProperties | undefined => {
  if (!menuRef) {
    return;
  }
  if (shouldBeFixed) {
    return getFixedMenuStyles(ref, menuRef);
  }

  const { right } = menuRef.getBoundingClientRect();

  if (window.innerWidth < right) {
    return { right: 0 };
  }
};

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
    menuButton,
    shouldBeFixed = true,
  } = props;
  const menuButtonRef = useRef<HTMLElement>(null);
  const [menuRef, setMenuRef] = useState<HTMLUListElement | null>(null);
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

  const menuStyles = getMenuStyles(menuButtonRef, menuRef, shouldBeFixed);

  return (
    <>
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
          className={classNames(styles?.menuButton, {
            "custom-dropdown-wrapper__menu-button": !menuButton,
          })}
          ref={menuButtonRef}
        >
          {menuButton || (
            <>
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
            </>
          )}
        </MenuButton>
        <Menu
          className={classNames("custom-dropdown-wrapper__menu", styles?.menu, {
            "custom-dropdown-wrapper__menu--fixed": shouldBeFixed,
          })}
          style={menuStyles}
        >
          <ul
            className={classNames(
              "custom-dropdown-wrapper__menu-list",
              styles?.menuList
            )}
            style={menuStyles?.bottom === 0 ? { maxHeight: "100%" } : undefined}
            ref={setMenuRef}
          >
            {options.map((option) => (
              <MenuItem
                key={String(option.value)}
                className={classNames(
                  "custom-dropdown-wrapper__menu-item",
                  styles?.menuItem,
                  option.className,
                  {
                    "custom-dropdown-wrapper__menu-item--active":
                      option.value === selectedOption?.value,
                  }
                )}
                tag="li"
                value={option.value}
                text={
                  option.searchText ||
                  (typeof option.text === "string" ? option.text : undefined)
                }
              >
                {option.text}
              </MenuItem>
            ))}
          </ul>
        </Menu>
      </MenuWrapper>
      {isOpen && shouldBeFixed && <GlobalOverlay />}
    </>
  );
};

export default Dropdown;
