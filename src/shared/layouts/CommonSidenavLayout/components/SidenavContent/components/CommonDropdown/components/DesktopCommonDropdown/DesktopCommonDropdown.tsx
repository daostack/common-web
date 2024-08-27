import React, {
  FC,
  MouseEventHandler,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { Check2Icon, Menu2Icon } from "@/shared/icons";
import { MenuItem, MenuItemType } from "@/shared/interfaces";
import { getScreenSize } from "@/shared/store/selectors";
import { DesktopMenu } from "@/shared/ui-kit";
import { CREATE_COMMON_ITEM_ID } from "../../../ProjectsTree";
import styles from "./DesktopCommonDropdown.module.scss";

interface DesktopCommonDropdownProps {
  menuItemsClassName?: string;
  items: MenuItem[];
  activeItemId?: string | null;
  isActive: boolean;
}

const DesktopCommonDropdown: FC<DesktopCommonDropdownProps> = (props) => {
  const { menuItemsClassName, items, activeItemId, isActive } = props;
  const [menuRerenderHack, setMenuRerenderHack] = useState(false);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleItemClick = () => {
    setMenuRerenderHack((value) => !value);
  };

  const finalItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      className: classNames(item.className, styles.menuItem, {
        [styles.menuItemForCommonCreation]: item.id === CREATE_COMMON_ITEM_ID,
      }),
      activeClassName: classNames(item.activeClassName, styles.menuItemActive),
      text: (
        <>
          <span
            className={styles.menuItemText}
            title={typeof item.text === "string" ? item.text : ""}
          >
            {item.text}
          </span>
          {item.id === activeItemId && (
            <Check2Icon className={styles.checkIcon} />
          )}
        </>
      ),
      onClick: (event) => {
        event.preventDefault();
        handleItemClick();

        if (item.type !== MenuItemType.Link) {
          item.onClick(event);
        }
      },
    }));
  }, [items]);

  const onClick: MouseEventHandler = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const triggerEl = useMemo(
    () => (
      <ButtonIcon onClick={onClick}>
        {isMobileView ? (
          <span className={styles.changeLabel}>Change</span>
        ) : (
          <Menu2Icon
            className={classNames(styles.icon, {
              [styles.iconActive]: isActive,
            })}
          />
        )}
      </ButtonIcon>
    ),
    [onClick, isActive, isMobileView],
  );

  return (
    <div className={styles.container}>
      <DesktopMenu
        key={String(menuRerenderHack)}
        menuItemsClassName={classNames(styles.menuItems, menuItemsClassName)}
        triggerEl={triggerEl}
        items={finalItems}
        shouldPreventDefaultOnClose
      />
    </div>
  );
};

export default DesktopCommonDropdown;
