import React, { CSSProperties, FC, ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import {
  authentificated,
  selectUserStreamsWithNotificationsAmount,
} from "@/pages/Auth/store/selectors";
import { Tab, Tabs } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { Avatar2Icon, BlocksIcon, InboxIcon } from "@/shared/icons";
import { matchOneOfRoutes, openSidenav } from "@/shared/utils";
import { selectCommonLayoutLastCommonIdFromFeed } from "@/store/states";
import { setLastCommonIdFromFeed } from "@/store/states/commonLayout/actions";
import { LayoutTab } from "../../constants";
import { getActiveLayoutTab, getLayoutTabName } from "./utils";
import styles from "./LayoutTabs.module.scss";

interface LayoutTabsProps {
  className?: string;
  activeTab?: LayoutTab;
}

interface TabConfiguration {
  label: string;
  value: LayoutTab;
  icon: ReactNode;
  notificationsAmount?: number | null;
}

const LayoutTabs: FC<LayoutTabsProps> = (props) => {
  const { className } = props;
  const history = useHistory();
  const { id: commonIdFromUrl } = useParams<{ id: string }>();
  const { getCommonPagePath, getInboxPagePath, getProfilePagePath } =
    useRoutesContext();
  const dispatch = useDispatch();
  const lastCommonIdFromFeed = useSelector(
    selectCommonLayoutLastCommonIdFromFeed,
  );
  const isAuthenticated = useSelector(authentificated());
  const userStreamsWithNotificationsAmount = useSelector(
    selectUserStreamsWithNotificationsAmount(),
  );
  const finalUserStreamsWithNotificationsAmount =
    userStreamsWithNotificationsAmount &&
    userStreamsWithNotificationsAmount > 99
      ? 99
      : userStreamsWithNotificationsAmount;
  const activeTab =
    props.activeTab || getActiveLayoutTab(history.location.pathname);
  const tabs: TabConfiguration[] = [
    {
      label: getLayoutTabName(LayoutTab.Spaces),
      value: LayoutTab.Spaces,
      icon: <BlocksIcon />,
    },
    {
      label: getLayoutTabName(LayoutTab.Profile),
      value: LayoutTab.Profile,
      icon: <Avatar2Icon className={styles.avatarIcon} color="currentColor" />,
    },
  ];

  if (isAuthenticated) {
    tabs.splice(1, 0, {
      label: getLayoutTabName(LayoutTab.Inbox),
      value: LayoutTab.Inbox,
      icon: <InboxIcon />,
      notificationsAmount: finalUserStreamsWithNotificationsAmount || null,
    });
  }

  const itemStyles = {
    "--items-amount": tabs.length,
  } as CSSProperties;

  const handleSpacesClick = () => {
    if (lastCommonIdFromFeed) {
      history.push(getCommonPagePath(lastCommonIdFromFeed));
    } else {
      openSidenav();
    }
  };

  const handleTabChange = (value: unknown) => {
    if (activeTab === value) {
      return;
    }

    switch (value) {
      case LayoutTab.Spaces:
        handleSpacesClick();
        break;
      case LayoutTab.Inbox:
        history.push(getInboxPagePath());
        break;
      case LayoutTab.Profile:
        history.push(getProfilePagePath());
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (
      matchOneOfRoutes(
        history.location.pathname,
        [ROUTE_PATHS.COMMON, ROUTE_PATHS.V04_COMMON],
        { exact: false },
      )
    ) {
      dispatch(setLastCommonIdFromFeed(commonIdFromUrl));
    }
  }, [commonIdFromUrl]);

  return (
    <Tabs
      className={classNames(styles.tabs, className)}
      style={itemStyles}
      value={activeTab}
      withIcons
      onChange={handleTabChange}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          className={styles.tab}
          label={tab.label}
          value={tab.value}
          icon={
            <div className={styles.iconWrapper}>
              {tab.icon}
              {typeof tab.notificationsAmount === "number" && (
                <span className={styles.iconBadge}>
                  {tab.notificationsAmount}
                </span>
              )}
            </div>
          }
          includeDefaultMobileStyles={false}
        />
      ))}
    </Tabs>
  );
};

export default LayoutTabs;
