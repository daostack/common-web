import React, {
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  forwardRef,
  CSSProperties,
  ForwardRefRenderFunction,
  ReactNode,
  useEffect,
} from "react";
import {
  Button as MenuButton,
  Menu,
  MenuItem,
  Wrapper as MenuWrapper,
  WrapperProps as MenuWrapperProps,
  openMenu,
  closeMenu,
} from "react-aria-menubutton";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { useChatContentContext } from "@/pages/common/components/CommonContent/context";
import { Loader } from "@/shared/components";
import RightArrowIcon from "../../icons/rightArrow.icon";
import { GlobalOverlay } from "../GlobalOverlay";
import { getMenuStyles } from "./helpers";
import "./index.scss";

export interface Styles {
  labelWrapper?: string;
  menuButton?: string;
  value?: string;
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

export enum ElementDropdownMenuItems {
  Share,
  Report,
  Delete,
  Copy,
  Edit,
  Reply,
  CopyLink,
  Hide,
}

export interface DropdownRef {
  openDropdown: (focusMenu?: boolean) => void;
  closeDropdown: () => void;
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
  fullMenuButtonChange?: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
  isLoading?: boolean;
  menuInlineStyle?: CSSProperties;
  isOpen?: boolean;
  disabled?: boolean;
}

const Dropdown: ForwardRefRenderFunction<DropdownRef, DropdownProps> = (
  props,
  dropdownRef,
) => {
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
    onMenuToggle,
    fullMenuButtonChange = false,
    shouldBeFixed = true,
    isLoading = false,
    menuInlineStyle,
    isOpen: isMenuOpen,
    disabled = false,
  } = props;
  const menuButtonRef = useRef<HTMLElement>(null);
  const [menuRef, setMenuRef] = useState<HTMLUListElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const dropdownId = useMemo(() => `dropdown-${uuidv4()}`, []);
  const { isScrolling: isChatScrolling, chatContentRect } =
    useChatContentContext();

  const handleSelection: MenuWrapperProps<HTMLElement>["onSelection"] = (
    value,
    event,
  ) => {
    event.stopPropagation();
    onSelect(value);
  };

  useEffect(() => {
    if (dropdownId && isMenuOpen) {
      openMenu(dropdownId, { focusMenu: true });
      setIsOpen(true);
    }
  }, [dropdownId, isMenuOpen]);

  const handleMenuToggle: MenuWrapperProps<HTMLElement>["onMenuToggle"] = ({
    isOpen,
  }) => {
    setIsOpen(isOpen);

    if (onMenuToggle) {
      onMenuToggle(isOpen);
    }
  };

  useEffect(() => {
    if (isMenuOpen && isChatScrolling) {
      handleMenuToggle({ isOpen: false });
      closeMenu(dropdownId);
    }
  }, [isMenuOpen, isChatScrolling]);

  const menuStyles = useMemo(
    () => getMenuStyles(menuButtonRef, menuRef, chatContentRect, shouldBeFixed),
    [menuRef, shouldBeFixed, chatContentRect],
  );

  useImperativeHandle(
    dropdownRef,
    () => ({
      openDropdown: (focusMenu = true) => {
        openMenu(dropdownId, { focusMenu });
      },
      closeDropdown: () => {
        closeMenu(dropdownId);
      },
    }),
    [dropdownId],
  );

  return (
    <>
      <MenuWrapper
        id={dropdownId}
        className={classNames("custom-dropdown-wrapper", className)}
        onSelection={handleSelection}
        onMenuToggle={handleMenuToggle}
      >
        {label && (
          <div
            className={classNames(
              "custom-dropdown-wrapper__label-wrapper",
              styles?.labelWrapper,
            )}
          >
            <span className="custom-dropdown-wrapper__label">{label}</span>
          </div>
        )}
        {fullMenuButtonChange && (
          <>
            <MenuButton
              className={classNames({
                "custom-dropdown-wrapper__menu-button--disabled": disabled,
              })}
              disabled={disabled}
            />
            <div>{menuButton}</div>
          </>
        )}
        {!fullMenuButtonChange && (
          <MenuButton
            className={classNames(styles?.menuButton, {
              "custom-dropdown-wrapper__menu-button": !menuButton,
              "custom-dropdown-wrapper__menu-button--disabled": disabled,
            })}
            disabled={disabled}
            ref={menuButtonRef}
          >
            {menuButton || (
              <>
                <span
                  className={classNames(
                    "custom-dropdown-wrapper__value",
                    styles?.value,
                    {
                      [classNames(
                        "custom-dropdown-wrapper__placeholder",
                        styles?.placeholder,
                      )]: !menuButtonText && !selectedOption && placeholder,
                    },
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
                    },
                  )}
                />
              </>
            )}
          </MenuButton>
        )}
        <Menu
          className={classNames("custom-dropdown-wrapper__menu", styles?.menu, {
            "custom-dropdown-wrapper__menu--fixed": shouldBeFixed,
          })}
          style={{ ...menuStyles, ...menuInlineStyle }}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <ul
              className={classNames(
                "custom-dropdown-wrapper__menu-list",
                styles?.menuList,
              )}
              style={
                menuStyles?.bottom === 0 ? { maxHeight: "100%" } : undefined
              }
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
                    },
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
          )}
        </Menu>
      </MenuWrapper>
      {isOpen && shouldBeFixed && (
        <GlobalOverlay className="custom-dropdown-wrapper__global-overlay" />
      )}
    </>
  );
};

export default forwardRef(Dropdown);
