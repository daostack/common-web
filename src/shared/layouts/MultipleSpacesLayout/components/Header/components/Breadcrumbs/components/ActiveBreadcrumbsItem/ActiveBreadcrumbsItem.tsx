import React, { FC, useRef } from "react";
import { useSelector } from "react-redux";
import { ButtonIcon, UserAvatar } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { RightArrowThinIcon } from "@/shared/icons";
import { getScreenSize } from "@/shared/store/selectors";
import { ContextMenuRef } from "@/shared/ui-kit";
import { ProjectsStateItem } from "@/store/states";
import { truncateBreadcrumbName } from "../../utils";
import { BreadcrumbsMenu } from "../BreadcrumbsMenu";
import styles from "./ActiveBreadcrumbsItem.module.scss";

export interface ActiveBreadcrumbsItemProps {
  name: string;
  image?: string;
  items?: ProjectsStateItem[];
  commonIdToAddProject?: string | null;
  withMenu?: boolean;
  isLoading?: boolean;
}

const ActiveBreadcrumbsItem: FC<ActiveBreadcrumbsItemProps> = (props) => {
  const {
    name,
    image,
    items = [],
    commonIdToAddProject,
    withMenu = true,
    isLoading = false,
  } = props;
  const itemsButtonRef = useRef<HTMLButtonElement>(null);
  const contextMenuRef = useRef<ContextMenuRef>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleButtonClick = () => {
    if (itemsButtonRef.current) {
      const { x, y, height } = itemsButtonRef.current.getBoundingClientRect();
      contextMenuRef.current?.open(x, y + height);
    }
  };

  return (
    <li className={styles.container}>
      {image && (
        <UserAvatar
          className={styles.image}
          photoURL={image}
          nameForRandomAvatar={name}
          userName={name}
        />
      )}
      <span className={styles.name}>
        {isMobileView ? truncateBreadcrumbName(name) : name}
      </span>
      {(items.length > 0 || commonIdToAddProject) && withMenu && (
        <ButtonIcon
          ref={itemsButtonRef}
          className={styles.itemsButton}
          onClick={handleButtonClick}
        >
          <RightArrowThinIcon className={styles.itemsIcon} />
        </ButtonIcon>
      )}
      {withMenu && (
        <BreadcrumbsMenu
          ref={contextMenuRef}
          items={items}
          commonIdToAddProject={commonIdToAddProject}
          isLoading={isLoading}
        />
      )}
    </li>
  );
};

export default ActiveBreadcrumbsItem;
