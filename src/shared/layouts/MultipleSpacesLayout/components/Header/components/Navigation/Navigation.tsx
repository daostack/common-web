import React, { FC } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import classNames from "classnames";
import {
  selectIsAuthenticated,
  selectUser,
  selectUserStreamsWithNotificationsAmount,
} from "@/pages/Auth/store/selectors";
import { ROUTE_PATHS } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { useModal } from "@/shared/hooks";
import {
  useLastVisitedCommon,
  useUserCommonIds,
} from "@/shared/hooks/useCases";
import { Blocks2Icon, InboxIcon } from "@/shared/icons";
import {
  CommonSidenavLayoutTab,
  getActiveLayoutTab,
} from "@/shared/layouts/CommonSidenavLayout";
import { CreateCommonPrompt, NavigationItem } from "./components";
import { NavigationItemOptions } from "./types";
import styles from "./Navigation.module.scss";

interface NavigationProps {
  className?: string;
}

const Navigation: FC<NavigationProps> = (props) => {
  const { className } = props;
  const location = useLocation();
  const { getCommonPagePath, getInboxPagePath } = useRoutesContext();
  const {
    isShowing: isCreateCommonPromptOpen,
    onOpen: onCreateCommonPromptOpen,
    onClose: onCreateCommonPromptClose,
  } = useModal(false);
  const isAuthenticated = useSelector(selectIsAuthenticated());
  const userStreamsWithNotificationsAmount = useSelector(
    selectUserStreamsWithNotificationsAmount(),
  );
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const { data: userCommonIds } = useUserCommonIds();
  const { lastVisitedCommon } = useLastVisitedCommon(userId);
  const mySpacesCommonId = lastVisitedCommon?.id || userCommonIds[0] || "";
  const mySpacesPagePath = (
    mySpacesCommonId ? getCommonPagePath(mySpacesCommonId) : ""
  ) as ROUTE_PATHS;
  const inboxPagePath = getInboxPagePath() as ROUTE_PATHS;
  const activeTab = getActiveLayoutTab(location.pathname);
  const items: NavigationItemOptions[] = [
    {
      text: "My spaces",
      route: mySpacesPagePath,
      icon: <Blocks2Icon className={styles.blocksIcon} />,
      isActive: activeTab === CommonSidenavLayoutTab.Spaces,
      onClick: !mySpacesPagePath ? onCreateCommonPromptOpen : undefined,
    },
    {
      text: `Inbox${
        userStreamsWithNotificationsAmount
          ? ` (${userStreamsWithNotificationsAmount})`
          : ""
      }`,
      route: inboxPagePath,
      icon: <InboxIcon className={styles.inboxIcon} />,
      isActive: activeTab === CommonSidenavLayoutTab.Inbox,
      isDisabled: !isAuthenticated,
      tooltipContent: !isAuthenticated ? (
        <>Inbox will be enabled once you log in 🙂</>
      ) : null,
    },
  ];

  return (
    <nav className={classNames(styles.container, className)}>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={index}>
            <NavigationItem {...item} />
          </li>
        ))}
      </ul>
      {isCreateCommonPromptOpen && (
        <CreateCommonPrompt isOpen onClose={onCreateCommonPromptClose} />
      )}
    </nav>
  );
};

export default Navigation;
