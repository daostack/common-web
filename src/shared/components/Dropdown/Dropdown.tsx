import React, {
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  forwardRef,
  CSSProperties,
  ForwardRefRenderFunction,
  ReactNode,
  RefObject,
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
import { useHoverDirty } from "react-use";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { Loader } from "@/shared/components";
import RightArrowIcon from "../../icons/rightArrow.icon";
import { GlobalOverlay } from "../GlobalOverlay";
import "./index.scss";

export interface Styles {
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
  withHover?: boolean;
  isHovering?: boolean;
  isOpen?: boolean;
}

const getFixedMenuStyles = (
  ref: RefObject<HTMLElement>,
  menuRef: HTMLUListElement | null,
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
  shouldBeFixed?: boolean,
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
    withHover = false,
    isHovering = false,
    menuInlineStyle,
    isOpen: isMenuOpen,
  } = props;
  const menuButtonRef = useRef<HTMLElement>(null);
  const [menuRef, setMenuRef] = useState<HTMLUListElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const dropdownId = useMemo(() => `dropdown-${uuidv4()}`, []);

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

  const menuStyles = useMemo(
    () => getMenuStyles(menuButtonRef, menuRef, shouldBeFixed),
    [menuRef, shouldBeFixed],
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
          <div className="custom-dropdown-wrapper__label-wrapper">
            <span className="custom-dropdown-wrapper__label">{label}</span>
          </div>
        )}
        {fullMenuButtonChange && (
          <>
            <MenuButton />
            <div>{menuButton}</div>
          </>
        )}
        {!fullMenuButtonChange && (
          <MenuButton
            className={classNames(styles?.menuButton, {
              "custom-dropdown-wrapper__menu-button": !menuButton,
              "custom-dropdown-wrapper_menu-button--hidden":
                !isHovering && withHover,
            })}
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
